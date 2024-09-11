package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.fund.entity.QTradeRecord;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.entity.QStock;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;

@Repository
public class TradeRepositoryCustomImpl implements TradeRepositoryCustom{

    private final JPAQueryFactory jpaQueryFactory;

    public TradeRepositoryCustomImpl(JPAQueryFactory jpaQueryFactory) { this.jpaQueryFactory = jpaQueryFactory; }

    @Override
    public TradeDto findTradeByStockCode(String stockCode) {
        QTradeRecord tradeRecord = QTradeRecord.tradeRecord;
        QStock stock = QStock.stock;

        return jpaQueryFactory
                .select(Projections.constructor(TradeDto.class,
                        tradeRecord.amount,
                        tradeRecord.tradeSharesCount,
                        tradeRecord.reason,
                        tradeRecord.tradeType
                        ))
                .from(tradeRecord)
                .join(tradeRecord.stock, stock)
                .where(stock.stockCode.eq(stockCode))
                .fetchOne();
    }
}
