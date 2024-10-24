package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.constant.RedisExpireTime;
import com.beautifulyomin.mmmm.constant.RedisKey;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.stock.dto.data.*;
import com.beautifulyomin.mmmm.domain.stock.dto.request.StockFilterRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockDetailResponseDto;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockResponse;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockWithFavoriteStatusDto;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock52weekData;
import com.beautifulyomin.mmmm.domain.stock.entity.key.DailyStockDataId;
import com.beautifulyomin.mmmm.domain.stock.exception.StockNotFoundException;
import com.beautifulyomin.mmmm.domain.stock.repository.Stock52weekDataRepository;
import com.beautifulyomin.mmmm.domain.stock.repository.StockLikeRepository;
import com.beautifulyomin.mmmm.domain.stock.repository.StockRepository;
import com.beautifulyomin.mmmm.domain.stock.repository.StockRepositoryCustom;
import com.beautifulyomin.mmmm.util.JsonConverter;
import com.beautifulyomin.mmmm.util.RedisUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class StockServiceImpl implements StockService {

    private final Stock52weekDataRepository stock52weekDataRepository;
    private final StockLikeRepository stockLikeRepository;
    private final ChildrenRepository childrenRepository;
    private StockRepository stockRepository;
    private StockRepositoryCustom stockRepositoryCustom;
    private final RedisUtil redisUtil;
    private final JsonConverter jsonConverter;


    @Autowired
    public StockServiceImpl(StockRepository stockRepository, StockRepositoryCustom stockRepositoryCustom, Stock52weekDataRepository stock52weekDataRepository, StockLikeRepository stockLikeRepository, ChildrenRepository childrenRepository, RedisUtil redisUtil, JsonConverter jsonConverter) {
        this.stockRepository = stockRepository;
        this.stockRepositoryCustom = stockRepositoryCustom;
        this.stock52weekDataRepository = stock52weekDataRepository;
        this.stockLikeRepository = stockLikeRepository;
        this.childrenRepository = childrenRepository;
        this.redisUtil = redisUtil;
        this.jsonConverter = jsonConverter;
    }


    @Override
    public StockDetailResponseDto getStockDetailResponse(String stockCode, String userId) {
        StockDto stockDto = getStock(stockCode, userId);
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
    public Page<StockResponse> getFilteredStocks(StockFilterRequestDto filterRequestDto, String userId, Pageable pageable) {
        log.info("getFilteredStocks 진입");
        log.info("filterRequestDto: {}", filterRequestDto);
        log.info("searchList: {}", filterRequestDto.getSearchList());
        log.info("searchList: {}", filterRequestDto);

        Page<StockResponse> stocks = stockRepositoryCustom.findFilteredStocks(filterRequestDto, pageable);
        if (userId == null) //사용자가 없으면 기본만 반환
            return stocks;

        Set<String> favoriteStockCodes; //사용자가 있으면 관심 종목 추가해 반환
        favoriteStockCodes = stockRepositoryCustom.findStockCodesByChildrenUserId(userId);
        log.info("favoriteStockCodes={}", favoriteStockCodes);
        List<StockResponse> stockResponses = stocks.stream()
                .map(stock -> {
                    boolean isFavorite = favoriteStockCodes.contains(stock.getStockCode());
                    return new StockWithFavoriteStatusDto(
                            stock.getCompanyName(),
                            stock.getStockCode(),
                            stock.getClosingDate(),
                            stock.getClosingPrice(),
                            stock.getPriceChangeSign(),
                            stock.getPriceChange(),
                            stock.getPriceChangeRate(),
                            stock.getMarketCapitalization(),
                            stock.getTradingVolume(),
                            isFavorite
                    );
                })
                .collect(Collectors.toList());

        return new PageImpl<>(stockResponses, pageable, stocks.getTotalPages());
    }

    @Override
    public boolean toggleFavoriteStock(String userId, String stockCode) {
        return stockRepositoryCustom.toggleFavoriteStock(userId, stockCode);
    }

    private StockDto getStock(String stockCode, String userId) {
        Stock stock = stockRepository.findById(stockCode)
                .orElseThrow(() -> new StockNotFoundException("stock", stockCode));

        StockDto stockDto = StockDto.builder()
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

        if (userId == null) //사용자가 없으면 기본만 반환
            return stockDto;

        Optional<Children> children = childrenRepository.findByUserId(userId);
        if (children.isEmpty()) throw new IllegalArgumentException(userId + "의 회원이 없습니다.");
        boolean isFavorite = stockLikeRepository.existsByStockAndChildren(stock, children.orElse(null));
        stockDto.setFavorite(isFavorite);
        return stockDto;

    }

    public DailyStockDataDto getDailyStockData(String stockCode) {
        String cachedData = redisUtil.getData(RedisKey.DAILY_STOCK_DATA.format(stockCode));
        if (cachedData != null) {
            return jsonConverter.convertFromJson(cachedData, DailyStockDataDto.class);
        }

        DailyStockDataDto dailyStockData = stockRepositoryCustom.findLatestDateByStockCode(stockCode);
        Stock52weekData stock52weekData = stock52weekDataRepository
                .findById(new DailyStockDataId(dailyStockData.getDate(), dailyStockData.getStockCode()))
                .orElseThrow(() -> new StockNotFoundException(stockCode, "stock52weekData"));

        DailyStockDataDto dailyStockDataDto = getDailyStockDataDto(dailyStockData, stock52weekData);

        redisUtil.setDataExpire(RedisKey.DAILY_STOCK_DATA.format(stockCode),
                jsonConverter.convertToJson(dailyStockData), RedisExpireTime.STOCK_CACHE_SEC.getExpireTime());
        return dailyStockDataDto;
    }

    private static DailyStockDataDto getDailyStockDataDto(DailyStockDataDto dailyStockData, Stock52weekData stock52weekData) {
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
        String cachedData = redisUtil.getData(RedisKey.DAILY_STOCK_CHARTS.format(stockCode));
        if (cachedData != null) {
            return jsonConverter.convertJsonToList(cachedData, DailyStockChartDto.class);
        }
        List<DailyStockChartDto> dailyStockCharts = stockRepositoryCustom.getLatestDailyStockCharts(stockCode);
        redisUtil.setDataExpire(RedisKey.DAILY_STOCK_CHARTS.format(stockCode),
                jsonConverter.convertListToJson(dailyStockCharts), RedisExpireTime.STOCK_CACHE_SEC.getExpireTime());
        return dailyStockCharts;
    }

    private List<DailyStockChartDto> getWeeklyStockCharts(String stockCode) {
        String cachedData = redisUtil.getData(RedisKey.WEEKLY_STOCK_CHARTS.format(stockCode));
        if (cachedData != null) {
            return jsonConverter.convertJsonToList(cachedData, DailyStockChartDto.class);
        }
        List<DailyStockChartDto> weeklyStockCharts = stockRepositoryCustom.getLatestWeeklyStockChart(stockCode);
        redisUtil.setDataExpire(RedisKey.WEEKLY_STOCK_CHARTS.format(stockCode),
                jsonConverter.convertListToJson(weeklyStockCharts), RedisExpireTime.STOCK_CACHE_SEC.getExpireTime());
        return weeklyStockCharts;
    }

    private List<DailyStockChartDto> getMonthlyStockCharts(String stockCode) {
        String cachedData = redisUtil.getData(RedisKey.MONTHLY_STOCK_CHARTS.format(stockCode));
        if (cachedData != null) {
            return jsonConverter.convertJsonToList(cachedData, DailyStockChartDto.class);
        }
        List<DailyStockChartDto> monthlyStockCharts = stockRepositoryCustom.getLatestMonthlyStockChart(stockCode);
        redisUtil.setDataExpire(RedisKey.MONTHLY_STOCK_CHARTS.format(stockCode),
                jsonConverter.convertListToJson(monthlyStockCharts), RedisExpireTime.STOCK_CACHE_SEC.getExpireTime());
        return monthlyStockCharts;
    }
}
