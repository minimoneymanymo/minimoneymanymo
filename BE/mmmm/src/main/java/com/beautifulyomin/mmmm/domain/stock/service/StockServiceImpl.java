package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.stock.dto.data.*;
import com.beautifulyomin.mmmm.domain.stock.dto.request.StockFilterRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockDetailResponseDto;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockFilterResponseDto;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock52weekData;
import com.beautifulyomin.mmmm.domain.stock.entity.key.DailyStockDataId;
import com.beautifulyomin.mmmm.domain.stock.exception.StockNotFoundException;
import com.beautifulyomin.mmmm.domain.stock.repository.Stock52weekDataRepository;
import com.beautifulyomin.mmmm.domain.stock.repository.StockRepository;
import com.beautifulyomin.mmmm.domain.stock.repository.StockRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class StockServiceImpl implements StockService {
    private final Stock52weekDataRepository stock52weekDataRepository;
    private StockRepository stockRepository;
    private StockRepositoryCustom stockRepositoryCustom;

    @Autowired
    public StockServiceImpl(StockRepository stockRepository, StockRepositoryCustom stockRepositoryCustom, Stock52weekDataRepository stock52weekDataRepository) {
        this.stockRepository = stockRepository;
        this.stockRepositoryCustom = stockRepositoryCustom;
        this.stock52weekDataRepository = stock52weekDataRepository;
    }


    @Override
    @Cacheable(value = "stockDetail", key = "#stockCode")
    public StockDetailResponseDto getStockDetailResponse(String stockCode) {
        StockDto stockDto = getStock(stockCode);
        DailyStockDataDto dailyStockDataDto = getDailyStockData(stockCode);
        List<DailyStockChartDto> dailyStockChartDto = getDailyStockCharts(stockCode);
        List<DailyStockChartDto> weeklyStockChartDto = getWeeklyStockCharts(stockCode);
        List<DailyStockChartDto> monthlyStockChartDto = getMonthlyStockCharts(stockCode);

        return StockDetailResponseDto.builder()
                .stock(stockDto)
                .dailyStockData(dailyStockDataDto)
                .dailyStockChart(dailyStockChartDto)
                .weeklyStockChart(weeklyStockChartDto)
                .monthlyStockChart(monthlyStockChartDto)
                .build();
    }

    @Override
    public Page<StockFilterResponseDto> getFilteredStocks(StockFilterRequestDto filterRequestDto, Pageable pageable) {
        return stockRepositoryCustom.findStocksWithFilters(filterRequestDto, pageable);
    }

    @Override
    public void toggleFavoriteStock(String userId, String stockCode) {
        stockRepositoryCustom.toggleFavoriteStock(userId, stockCode);
    }

    private StockDto getStock(String stockCode) {
        Stock stock = stockRepository.findById(stockCode)
                .orElseThrow(() -> new StockNotFoundException(stockCode));

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
        DailyStockDataDto dailyStockData = stockRepositoryCustom.findLatestDateByStockCode(stockCode);
        Stock52weekData stock52weekData = stock52weekDataRepository
                .findById(new DailyStockDataId(dailyStockData.getDate(), dailyStockData.getStockCode()))
                .orElseThrow(() -> new StockNotFoundException(stockCode));

        return DailyStockDataDto.builder()
                .stockCode(dailyStockData.getStockCode())
                .marketCapitalization(dailyStockData.getMarketCapitalization())
                .priceChangeSign(dailyStockData.getPriceChangeSign())
                .priceChange(dailyStockData.getPriceChange())
                .priceChangeRate(dailyStockData.getPriceChangeRate())
                .peRatio(dailyStockData.getPeRatio())
                .pbRatio(dailyStockData.getPbRatio())
                .earningsPerShare(dailyStockData.getEarningsPerShare())
                .bookValuePerShare(dailyStockData.getBookValuePerShare())
                .foreignNetBuyVolume(dailyStockData.getForeignNetBuyVolume())
                .htsForeignExhaustionRate(dailyStockData.getHtsForeignExhaustionRate())
                .programNetBuyVolume(dailyStockData.getProgramNetBuyVolume())
                .volumeTurnoverRatio(dailyStockData.getVolumeTurnoverRatio())
                .tradingValue(dailyStockData.getTradingValue())
                .outstandingShares(dailyStockData.getOutstandingShares())
                .high52Week(stock52weekData.getHigh52Week())
                .high52WeekDate(stock52weekData.getHigh52WeekDate())
                .low52Week(stock52weekData.getLow52Week())
                .low52WeekDate(stock52weekData.getLow52WeekDate())
                .build();
    }

    private List<DailyStockChartDto> getDailyStockCharts(String stockCode) {
        return stockRepositoryCustom.getLatestDailyStockCharts(stockCode);
    }

    private List<DailyStockChartDto> getWeeklyStockCharts(String stockCode) {
        return stockRepositoryCustom.getLatestWeeklyStockChart(stockCode);
    }

    private List<DailyStockChartDto> getMonthlyStockCharts(String stockCode) {
        return stockRepositoryCustom.getLatestMonthlyStockChart(stockCode);
    }

}
