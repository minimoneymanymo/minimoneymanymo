package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockDataDto;

public interface StockRepositoryCustom {
    DailyStockDataDto findLatestDateByStockCode(String stockCode);
}
