package com.beautifulyomin.mmmm.domain.stock.dto.response;

import com.beautifulyomin.mmmm.domain.stock.dto.data.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class StockDetailResponseDto  implements Serializable {
    private StockDto stock;
    private DailyStockDataDto dailyStockData;
    private List<DailyStockChartDto> dailyStockChart;
    private List<DailyStockChartDto> weeklyStockChart;
    private List<DailyStockChartDto> monthlyStockChart;
}
