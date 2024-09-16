package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockDataDto;
import com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockData;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
public class StockRepositoryCustomImpl implements StockRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public StockRepositoryCustomImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public DailyStockDataDto findLatestDateByStockCode(String stockCode) {
        QDailyStockData dailyStockData = QDailyStockData.dailyStockData;
        return queryFactory
                .select(Projections.constructor(DailyStockDataDto.class,
                        dailyStockData.stockCode,
                        dailyStockData.date,
                        dailyStockData.marketCapitalization,
                        dailyStockData.priceChangeSign,
                        dailyStockData.priceChange,
                        dailyStockData.priceChangeRate,
                        dailyStockData.peRatio,
                        dailyStockData.pbRatio,
                        dailyStockData.earningsPerShare,
                        dailyStockData.bookValuePerShare,
                        dailyStockData.foreignNetBuyVolume,
                        dailyStockData.htsForeignExhaustionRate,
                        dailyStockData.programNetBuyVolume,
                        dailyStockData.volumeTurnoverRatio,
                        dailyStockData.tradingValue,
                        dailyStockData.outstandingShares))
                .from(dailyStockData)
                .where(dailyStockData.stockCode.eq(stockCode))
                .orderBy(dailyStockData.date.desc())
                .limit(1)
                .fetchOne();
    }
}
