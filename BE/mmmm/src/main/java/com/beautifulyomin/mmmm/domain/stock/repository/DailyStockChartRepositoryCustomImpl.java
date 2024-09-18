package com.beautifulyomin.mmmm.domain.stock.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

import java.math.BigDecimal;

import static com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockChart.dailyStockChart;

public class DailyStockChartRepositoryCustomImpl implements DailyStockChartRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    public DailyStockChartRepositoryCustomImpl(JPAQueryFactory jpaQueryFactory) { this.jpaQueryFactory = jpaQueryFactory; }

    @Override
    public BigDecimal findClosingPriceByStockCode(String stockCode) {
        return jpaQueryFactory
                .select(dailyStockChart.closingPrice)
                .from(dailyStockChart)
                .where(dailyStockChart.stockCode.eq(stockCode))
                .fetchOne(); // 단일 결과 반환
    }

}
