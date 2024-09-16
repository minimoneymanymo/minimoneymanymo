package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyDto;
import com.beautifulyomin.mmmm.domain.fund.entity.QStocksHeld;
import com.beautifulyomin.mmmm.domain.fund.entity.QTradeRecord;
import com.beautifulyomin.mmmm.domain.fund.entity.QTransactionRecord;
import com.beautifulyomin.mmmm.domain.member.entity.QChildren;
import com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockChart;
import com.beautifulyomin.mmmm.domain.stock.entity.QStock;
import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;


@Repository
public class FundRepositoryCustomImpl implements FundRepositoryCustom{

    private final JPAQueryFactory jpaQueryFactory;

    public FundRepositoryCustomImpl(JPAQueryFactory jpaQueryFactory) {
        this.jpaQueryFactory = jpaQueryFactory;
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
}
