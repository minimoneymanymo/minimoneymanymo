package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockChartDto;
import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockDataDto;

import java.util.List;

public interface StockRepositoryCustom {
    DailyStockDataDto findLatestDateByStockCode(String stockCode);

    List<DailyStockChartDto> getLatestDailyStockCharts(String stockCode);

    List<DailyStockChartDto> getLatestWeeklyStockChart(String stockCode);

    List<DailyStockChartDto> getLatestMonthlyStockChart(String stockCode);

    DailyStockChartDto getDailyStockChart(String stockCode);
}
