package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockChartDto;
import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockDataDto;
import com.beautifulyomin.mmmm.domain.stock.dto.request.StockFilterRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface StockRepositoryCustom {
    DailyStockDataDto findLatestDateByStockCode(String stockCode);

    List<DailyStockChartDto> getLatestDailyStockCharts(String stockCode);

    List<DailyStockChartDto> getLatestWeeklyStockChart(String stockCode);

    List<DailyStockChartDto> getLatestMonthlyStockChart(String stockCode);

    DailyStockChartDto getDailyStockChart(String stockCode);

    Page<StockResponse> findFilteredStocks(StockFilterRequestDto filterRequestDto, Pageable pageable);

    boolean toggleFavoriteStock(String userId, String stockCode);

    Set<String> findStockCodesByChildrenUserId(String userId);
}
