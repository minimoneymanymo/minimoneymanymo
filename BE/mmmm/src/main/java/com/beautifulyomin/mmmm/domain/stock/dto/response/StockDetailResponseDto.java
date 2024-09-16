package com.beautifulyomin.mmmm.domain.stock.dto.response;

import com.beautifulyomin.mmmm.domain.stock.dto.data.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class StockDetailResponseDto {
    private StockDto stock;
    private DailyStockDataDto dailyStockData;
    private List<DailyStockChartDto> dailyStockChart;
    private List<WeeklyStockChartDto> weeklyStockChart;
    private List<MonthlyStockChartDto> monthlyStockChart;
}
