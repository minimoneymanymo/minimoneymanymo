package com.beautifulyomin.mmmm.domain.stock.repository;

import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface DailyStockChartRepositoryCustom {
    BigDecimal findClosingPriceByStockCode(String stockCode);
    BigDecimal findLatestClosingPriceByStockCode(String stockCode);
}
