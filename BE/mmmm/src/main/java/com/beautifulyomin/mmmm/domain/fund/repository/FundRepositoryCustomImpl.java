package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.dto.*;
import com.beautifulyomin.mmmm.domain.fund.entity.*;
import com.beautifulyomin.mmmm.domain.member.dto.ParentWithBalanceDto;
import com.beautifulyomin.mmmm.domain.member.entity.*;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockChart;
import com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockData;
import com.beautifulyomin.mmmm.domain.stock.entity.QStock;
import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;


import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Slf4j
@Repository
public class FundRepositoryCustomImpl implements FundRepositoryCustom{

    private final JPAQueryFactory jpaQueryFactory;
    private final EntityManager entityManager;
    private final TransactionRepository transactionRepository;
    public FundRepositoryCustomImpl(JPAQueryFactory jpaQueryFactory, EntityManager entityManager, TransactionRepository transactionRepository) {
        this.jpaQueryFactory = jpaQueryFactory;
        this.entityManager = entityManager;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public List<MoneyChangeDto> findAllMoneyRecordsById(String childrenId) {
        QTransactionRecord transaction = QTransactionRecord.transactionRecord;
        QTradeRecord trade = QTradeRecord.tradeRecord;
        QStock stock = QStock.stock;

        // outer join 하거나, 아님 각각해서 더하던가
        List<MoneyChangeDto> transactionList = jpaQueryFactory
                .select(Projections.constructor(MoneyChangeDto.class,
                        transaction.amount,
                        transaction.tradeType,
                        transaction.createdAt,
                        transaction.remainAmount
                ))
                .from(transaction)
                .where(transaction.children.userId.eq(childrenId))
                .fetch();

        List<MoneyChangeDto> tradeList = jpaQueryFactory
                .select(Projections.constructor(MoneyChangeDto.class,
                        trade.amount,
                        trade.tradeType,
                        trade.createdAt,
                        stock.companyName,
                        trade.tradeSharesCount,
                        trade.remainAmount
                ))
                .from(trade)
                .join(trade.stock, stock)
                .where(trade.children.userId.eq(childrenId))
                .fetch();

        transactionList.addAll(tradeList);
        transactionList.sort((m1, m2) -> m2.getCreatedAt().compareTo(m1.getCreatedAt()));

        return transactionList;
    }

    @Override
    public MoneyDto findMoneyById(String childrenId) {
        QChildren children = QChildren.children;
        QStocksHeld stocksHeld = QStocksHeld.stocksHeld;
        QDailyStockChart dailyStockChart = QDailyStockChart.dailyStockChart;

        // 서브쿼리로 총 평가금액 계산
        BigDecimal totalAmount = Optional.ofNullable(
                jpaQueryFactory
                        .select(stocksHeld.remainSharesCount.multiply(dailyStockChart.closingPrice).sum())
                        .from(stocksHeld)
                        .join(dailyStockChart)
                        .on(stocksHeld.stock.stockCode.eq(dailyStockChart.stockCode)
                                .and(dailyStockChart.date.eq(
                                        JPAExpressions.select(dailyStockChart.date.max())
                                                .from(dailyStockChart)
                                                .where(dailyStockChart.stockCode.eq(stocksHeld.stock.stockCode)) // 동일한 stockCode에 대해
                                ))
                        )
                        .where(stocksHeld.children.userId.eq(childrenId))
                        .fetchOne()
        ).orElse(BigDecimal.ZERO);

        System.out.println("🎈🎈🎈🎈🎈");
        System.out.println(totalAmount);
        // 메인 쿼리: children의 money와 withdrawable_money 가져오기
        return jpaQueryFactory
                .select(Projections.constructor(MoneyDto.class,
                        children.money,
                        children.withdrawableMoney,
                        ConstantImpl.create(totalAmount)
                ))
                .from(children)
                .where(children.userId.eq(childrenId))
                .fetchOne();
    }

    @Override
    public List<WithdrawRequestDto> findAllWithdrawalRequest(Integer childrenId) {
        QTransactionRecord transaction =QTransactionRecord.transactionRecord;

        return jpaQueryFactory
                .select(Projections.constructor(WithdrawRequestDto.class,
                        transaction.createdAt,
                        transaction.approvedAt,
                        transaction.amount
                ))
                .from(transaction)
                .where(transaction.children.childrenId.eq(childrenId).and(transaction.tradeType.eq("1")))
                .orderBy(transaction.createdAt.desc())
                .limit(5)
                .fetch();
    }

    @Override
    @Transactional
    public long approveWithdrawalRequest(String parentId, Integer childrenId, Integer amount, String createdAt) {
        QTransactionRecord transaction =QTransactionRecord.transactionRecord;
        QChildren children = QChildren.children;
        QParent parent = QParent.parent;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        long rows = jpaQueryFactory
                .update(transaction)
                .set(transaction.approvedAt, LocalDateTime.now().format(formatter))
                .where(transaction.children.childrenId.eq(childrenId), transaction.createdAt.eq(createdAt))
                .execute();

        if(rows > 0){ // 업데이트가 발생하면
            // 자식의 출가금 잔액, 머니 잔액 변경
            jpaQueryFactory
                .update(children)
                .set(children.money, children.money.subtract(amount))
                .set(children.withdrawableMoney, children.withdrawableMoney.subtract(amount))
                .where(children.childrenId.eq(childrenId))
                .execute();

            // 부모의 마니모 계좌 충전금액 변경
            jpaQueryFactory
                    .update(parent)
                    .set(parent.balance, parent.balance.subtract(amount))
                    .where(parent.userId.eq(parentId))
                    .execute();
        }

        // 즉시 반영을 위함 -> 영속성 컨텍스트에 값이 남아있지 않도록!
        entityManager.flush();
        entityManager.clear();

        return rows;
    }

    @Override
    public List<TradeDto> findAllTradeRecord(Integer childrenId, Integer year, Integer month) {
        QTradeRecord trade = QTradeRecord.tradeRecord;

        String yearString = String.valueOf(year);
        String monthString = String.format("%02d", month);

        // 거래내역 조회 시 불러올 값
        // -> createdAt, 종목이름, 머니, 주, 이유, 타입, 이유보상머니(머니 지급 관련)
        return jpaQueryFactory
                .select(Projections.constructor(TradeDto.class,
                        trade.createdAt,
                        trade.stock.companyName,
                        trade.amount,
                        trade.tradeSharesCount,
                        trade.reason,
                        trade.reasonBonusMoney,
                        trade.tradeType,
                        trade.remainAmount,
                        trade.stockTradingGain
                ))
                .from(trade)
                .where(trade.children.childrenId.eq(childrenId)
                        .and(trade.createdAt.startsWith(yearString + monthString)))  // 연도와 월을 기준으로 필터링
                .orderBy(trade.createdAt.desc())
                .fetch();
    }

    private LocalDate fetchLatestDateByStockCode(String stockCode) {
        QDailyStockChart dailyStockChart = QDailyStockChart.dailyStockChart;
        return jpaQueryFactory
                .select(dailyStockChart.date.max())
                .from(dailyStockChart)
                .where(dailyStockChart.stockCode.eq(stockCode))
                .fetchFirst();
    }

    @Override
    public List<StockHeldDto> findAllStockHeld(Integer childrenId) {
        QStocksHeld stocksheld = QStocksHeld.stocksHeld;
        QStock stock = QStock.stock;
        QDailyStockChart dailyStockChart = QDailyStockChart.dailyStockChart;
        QDailyStockData dailyStockData = QDailyStockData.dailyStockData;

        List<StockHeldDto> result = jpaQueryFactory.select(Projections.constructor(StockHeldDto.class,
                        stocksheld.children.childrenId,
                        stocksheld.stock.stockCode,
                        stocksheld.remainSharesCount,
                        stocksheld.totalAmount))
                .from(stocksheld)
                .where(stocksheld.children.childrenId.eq(childrenId))
                .fetch();

        for (StockHeldDto dto : result) {
            String stockCode = dto.getStockCode();
            LocalDate latestDate = fetchLatestDateByStockCode(stockCode);
            StockHeldDto extra = jpaQueryFactory.select(Projections.constructor(StockHeldDto.class,
                            stock.companyName,
                            stock.marketName,
                            dailyStockChart.closingPrice,
                            dailyStockData.priceChangeSign,
                            dailyStockData.priceChange,
                            dailyStockData.priceChangeRate
                            ))
                    .from(stock)
                    .join(dailyStockChart)
                    .on(stock.stockCode.eq(dailyStockChart.stockCode)
                            .and(dailyStockChart.date.eq(latestDate)))
                    .join(dailyStockData)
                    .on(stock.stockCode.eq(dailyStockData.stockCode)
                            .and(dailyStockData.date.eq(latestDate)))
                    .where(stock.stockCode.eq(stockCode))  // 여기서 stockCode로 필터링
                    .fetchFirst();

            BigDecimal totalAmount = BigDecimal.valueOf(dto.getTotalAmount());
            BigDecimal remainSharesCount = dto.getRemainSharesCount();
            BigDecimal closingPrice = BigDecimal.valueOf(extra.getClosingPrice().doubleValue());  // double을 BigDecimal로 변환

            BigDecimal averagePrice = totalAmount.divide(remainSharesCount, RoundingMode.HALF_UP);
            BigDecimal evaluateMoney = remainSharesCount.multiply(closingPrice);

            // DTO에 값 설정
            dto.setCompanyName(extra.getCompanyName());
            dto.setMarketName(extra.getMarketName());
            dto.setClosingPrice(closingPrice);
            dto.setAveragePrice(averagePrice);
            dto.setEvaluateMoney(evaluateMoney);
            dto.setPriceChangeRate((closingPrice.subtract(averagePrice)).divide(averagePrice, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)));
            dto.setPriceChangeMoney(evaluateMoney.subtract(totalAmount));
            dto.setPriceChangeSign(extra.getPriceChangeSign());
            dto.setPriceChange(extra.getPriceChange());
            dto.setStockPriceChangeRate(extra.getStockPriceChangeRate());
        }
        result.sort(Comparator.comparing(StockHeldDto::getCompanyName));
        System.out.println(result);
        return result;
    }

    @Override
    public List<AllowancePaymentDto> findAllUnpaid(String parentUserId) {
        QTransactionRecord transaction =QTransactionRecord.transactionRecord;
        QParentAndChildren parentAndChildren = QParentAndChildren.parentAndChildren;

        List<Integer> childrenIdList= jpaQueryFactory
                .select(parentAndChildren.child.childrenId)
                .from(QParentAndChildren.parentAndChildren)
                .where(parentAndChildren.parent.userId.eq(parentUserId),
                        parentAndChildren.isApproved.eq(true))
                .fetch();

        List<AllowancePaymentDto> result = new ArrayList<>();

        for (Integer childrenId: childrenIdList) {
            List<AllowancePaymentDto> list =  jpaQueryFactory
                .select(Projections.constructor(AllowancePaymentDto.class,
                        transaction.transactionId,
                        transaction.children.childrenId,
                        transaction.createdAt,
                        transaction.amount,
                        transaction.children.name
                ))
                .from(transaction)
                .where(transaction.children.childrenId.eq(childrenId),transaction.approvedAt.isNull())
                .orderBy(transaction.createdAt.desc())
                .fetch();
            result.addAll(list);
        }
        return result;
    }



    @Override
    @Transactional
    public long updateAllowance( Integer amount, Integer parentId, Integer childrenId) {
        QChildren children = QChildren.children;
        QParent parent = QParent.parent;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        // 새로 용돈을 주는 경우
        // 자식 머니 증가
        jpaQueryFactory
                .update(children)
                .set(children.money, children.money.add(amount))
                .where(children.childrenId.eq(childrenId))
                .execute();

        // 부모의 마니모 계좌 충전금액 변경
        jpaQueryFactory
                .update(parent)
                .set(parent.balance, parent.balance.subtract(amount))
                .where(parent.parentId.eq(parentId))
                .execute();

        // 자식객체조회
        Children child = jpaQueryFactory
                .selectFrom(children)
                .where(children.childrenId.eq(childrenId))
                .fetchOne();
        child.setMoney(child.getMoney()+amount);

        TransactionRecord request = new TransactionRecord();
        request.setChildren(child);
        request.setAmount(amount);
        request.setTradeType("0"); //입금
        request.setRemainAmount(child.getMoney()+amount);
        request.setApprovedAt(LocalDateTime.now().format(formatter));
        transactionRepository.save(request);

        entityManager.flush();
        entityManager.clear();

        return 1;
    }


    @Override
    @Transactional
    public long updateAllowanceMonthly(ParentWithBalanceDto nowParent) {
        QParentAndChildren parentAndChildren = QParentAndChildren.parentAndChildren;
        QChildren children = QChildren.children;
        QParent parent = QParent.parent;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        //부모에게 딸린 자식 조회
        List<Children> childrenList = jpaQueryFactory
                .select(children)
                .from(parentAndChildren)
                .join(parentAndChildren.child, children)
                .where(parent.parentId.eq(nowParent.getParentId()))  // Filter by parent's userId
                .fetch();

        //자식들의 세팅 머니 합 확인
        Integer totalSettingMoney = jpaQueryFactory
                .select(children.settingMoney.sum())  // settingMoney의 합계를 구함
                .from(parentAndChildren)  // 부모-자식 관계 테이블에서
                .join(parentAndChildren.child, children)  // 자식 테이블과 조인
                .where(parentAndChildren.parent.parentId.eq(nowParent.getParentId()))  // 부모 ID로 필터링
                .fetchOne();

        // 자식에게 줘야할 용돈이 없는경우 return
        if(totalSettingMoney == null || totalSettingMoney == 0){
            return 0;
        }

        // 자식에게 줄 돈이 없는경우
        if(totalSettingMoney > nowParent.getBalance()){
            for(Children child: childrenList) {
                Integer settingMoney = child.getSettingMoney();
                //transactionRecord 에만 업데이트
                TransactionRecord request = new TransactionRecord();
                request.setChildren(child);
                request.setAmount(settingMoney);
                request.setTradeType("0");
                request.setRemainAmount(child.getMoney());
                transactionRepository.save(request);
            }
            return 0; //지급 실패
        }

        // 잔액이 충분함. 용돈주기.
        // 부모의 마니모 계좌 충전금액 차감
        jpaQueryFactory
            .update(parent)
            .set(parent.balance, parent.balance.subtract(totalSettingMoney))
            .where(parent.parentId.eq(nowParent.getParentId()))
            .execute();

        for(Children child: childrenList){
            Integer settingMoney = child.getSettingMoney();

            //자식 money 증가
            jpaQueryFactory
                .update(children)
                .set(children.money, children.money.add(children.settingMoney))
                .where(children.childrenId.eq(child.getChildrenId()))
                .execute();

            TransactionRecord request = new TransactionRecord();
            request.setChildren(child);
            request.setAmount(settingMoney);
            request.setTradeType("0");
            request.setApprovedAt(LocalDateTime.now().format(formatter));
            request.setRemainAmount(child.getMoney()+child.getSettingMoney());
            transactionRepository.save(request);
        }
            return 1; //지급 성공
    }



}
