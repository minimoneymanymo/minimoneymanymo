package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.entity.QTradeRecord;
import com.beautifulyomin.mmmm.domain.fund.entity.QTransactionRecord;
import com.beautifulyomin.mmmm.domain.member.entity.QChildren;
import com.beautifulyomin.mmmm.domain.stock.entity.QStock;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

//@RequiredArgsConstructor
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
                        null,
                        null,
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
                        null
                ))
                .from(trade)
                .join(trade.stock, stock)
                .where(trade.children.userId.eq(childrenId))
                .fetch();

        transactionList.addAll(tradeList);
        transactionList.sort((m1, m2) -> m2.getCreatedAt().compareTo(m1.getCreatedAt()));

        return transactionList;
    }
}
