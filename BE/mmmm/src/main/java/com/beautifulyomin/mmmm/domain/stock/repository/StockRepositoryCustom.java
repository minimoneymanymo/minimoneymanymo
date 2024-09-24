package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockChartDto;
import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockDataDto;
import com.beautifulyomin.mmmm.domain.stock.dto.request.StockFilterRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockFilterResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StockRepositoryCustom {
    DailyStockDataDto findLatestDateByStockCode(String stockCode);

    List<DailyStockChartDto> getLatestDailyStockCharts(String stockCode);

    List<DailyStockChartDto> getLatestWeeklyStockChart(String stockCode);

    List<DailyStockChartDto> getLatestMonthlyStockChart(String stockCode);

    DailyStockChartDto getDailyStockChart(String stockCode);

    Page<StockFilterResponseDto> findStocksWithFilters(StockFilterRequestDto filterRequestDto, Pageable pageable);

    boolean toggleFavoriteStock(String userId, String stockCode);
}
