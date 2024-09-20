package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyDto;
import com.beautifulyomin.mmmm.domain.fund.dto.WithdrawRequestDto;
import com.beautifulyomin.mmmm.domain.fund.entity.QStocksHeld;
import com.beautifulyomin.mmmm.domain.fund.entity.QTradeRecord;
import com.beautifulyomin.mmmm.domain.fund.entity.QTransactionRecord;
import com.beautifulyomin.mmmm.domain.member.entity.QChildren;
import com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockChart;
import com.beautifulyomin.mmmm.domain.stock.entity.QStock;
import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;


@Repository
public class FundRepositoryCustomImpl implements FundRepositoryCustom{

    private final JPAQueryFactory jpaQueryFactory;
    private final EntityManager entityManager;

    public FundRepositoryCustomImpl(JPAQueryFactory jpaQueryFactory, EntityManager entityManager) {
        this.jpaQueryFactory = jpaQueryFactory;
        this.entityManager = entityManager;
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
        BigDecimal totalAmount = jpaQueryFactory
                .select(stocksHeld.remainSharesCount.multiply(dailyStockChart.closingPrice).sum())
                .from(stocksHeld)
                .join(dailyStockChart)
                .on(stocksHeld.stock.stockCode.eq(dailyStockChart.stockCode))
                .where(stocksHeld.children.userId.eq(childrenId))
                .fetchOne();

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
                .where(transaction.children.childrenId.eq(childrenId))
                .orderBy(transaction.createdAt.desc())
                .limit(5)
                .fetch();
    }

    @Override
    @Transactional
    public long approveWithdrawalRequest(Integer childrenId, Integer amount, String createdAt) {
        QTransactionRecord transaction =QTransactionRecord.transactionRecord;
        QChildren children = QChildren.children;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        long rows = jpaQueryFactory
                .update(transaction)
                .set(transaction.approvedAt, LocalDateTime.now().format(formatter))
                .where(transaction.children.childrenId.eq(childrenId), transaction.createdAt.eq(createdAt))
                .execute();

        if(rows > 0){ // 업데이트가 발생하면
            jpaQueryFactory
                .update(children)
                .set(children.money, children.money.subtract(amount))
                .set(children.withdrawableMoney, children.withdrawableMoney.subtract(amount))
                .where(children.childrenId.eq(childrenId))
                .execute();
        }

        // 즉시 반영을 위함 -> 영속성 컨텍스트에 값이 남아있지 않도록!
        entityManager.flush();
        entityManager.clear();

        return rows;
    }

}
