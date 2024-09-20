package com.beautifulyomin.mmmm.domain.stock.repository;

import java.math.BigDecimal;

public interface DailyStockChartRepositoryCustom {
    BigDecimal findClosingPriceByStockCode(String stockCode);
    BigDecimal findLatestClosingPriceByStockCode(String stockCode);
}
