package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.stock.dto.data.*;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockDetailResponseDto;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import com.beautifulyomin.mmmm.domain.stock.exception.StockNotFountException;
import com.beautifulyomin.mmmm.domain.stock.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockServiceImpl implements StockService{
    private StockRepository stockRepository;

    @Autowired
    public StockServiceImpl(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }


    @Override
    public StockDetailResponseDto getStockDetailResponse(String stockCode) {
        StockDto stockDto = getStock(stockCode);
        DailyStockDataDto dailyStockDataDto = getDailyStockData(stockCode);
        List<DailyStockChartDto> dailyStockChartDto = getDailyStockCharts(stockCode);
        List<WeeklyStockChartDto> weeklyStockChartDto = getWeeklyStockCharts(stockCode);
        List<MonthlyStockChartDto> monthlyStockChartDto = getMonthlyStockCharts(stockCode);

        return StockDetailResponseDto.builder()
                .stock(stockDto)
                .dailyStockData(dailyStockDataDto)
                .dailyStockChart(dailyStockChartDto)
                .weeklyStockChart(weeklyStockChartDto)
                .monthlyStockChart(monthlyStockChartDto)
                .build();
    }

    private StockDto getStock(String stockCode) {
        Stock stock = stockRepository.findById(stockCode)
                .orElseThrow(()->new StockNotFountException(stockCode));

        return StockDto.builder()
                .stockCode(stockCode)
                .companyName(stock.getCompanyName())
                .industry(stock.getIndustry())
                .mainProducts(stock.getMainProducts())
                .listingDate(stock.getListingDate())
                .settlementMonth(stock.getSettlementMonth())
                .ceoName(stock.getCeoName())
                .region(stock.getRegion())
                .marketName(stock.getMarketName())
                .faceValue(stock.getFaceValue())
                .currencyName(stock.getCurrencyName())
                .build();
    }

    private DailyStockDataDto getDailyStockData(String stockCode) {
        return null;
    }

    private List<DailyStockChartDto> getDailyStockCharts(String stockCode) {
        return null;
    }

    private List<WeeklyStockChartDto> getWeeklyStockCharts(String stockCode) {
        return null;
    }

    private List<MonthlyStockChartDto> getMonthlyStockCharts(String stockCode) {
        return null;
    }

}
