package com.beautifulyomin.mmmm.simulation;

import com.beautifulyomin.mmmm.config.QueryDslConfig;
import com.beautifulyomin.mmmm.domain.stock.entity.DailyStockChart;
import com.beautifulyomin.mmmm.domain.stock.repository.DailyStockChartRepository;
import com.beautifulyomin.mmmm.simulation.data.MarketStocks;
import com.beautifulyomin.mmmm.simulation.data.Stock;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@TestPropertySource(locations = "classpath:application-test.properties")
@SpringBootTest
@Import({QueryDslConfig.class})
public class tradeSimulation {

    private final LocalDate START_DATE = LocalDate.of(2024, 9, 1);
    private final LocalDate END_DATE = LocalDate.of(2024, 9, 30);

    private List<Stock> stocks;
    private DailyStockChartRepository dailyStockChartRepository;

    @Autowired
    public tradeSimulation(DailyStockChartRepository dailyStockChartRepository) {
        this.dailyStockChartRepository = dailyStockChartRepository;
        this.stocks = initializeStocks();
    }

    @Test
    public void loadDailyChangeRates() {
        for (Stock stock : stocks) {
            List<DailyStockChart> dailyChartData = dailyStockChartRepository
                    .findByStockCodeAndDateBetweenOrderByDateAsc(stock.getStockCode(), START_DATE, END_DATE);

            Map<LocalDate, Double> changeRates = calculateDailyChangeRates(dailyChartData);
            stock.setDailyChangeRates(changeRates);
        }

        System.out.println("stocks = " + stocks);
    }

    //daily_stock_data에는 데이터가 부족해서 차트데이터로 하나하나 등락률 계산
    private Map<LocalDate, Double> calculateDailyChangeRates(List<DailyStockChart> dailyChartData) {
        Map<LocalDate, Double> changeRates = new HashMap<>();

        for (int i = 1; i < dailyChartData.size(); i++) {
            DailyStockChart previousDay = dailyChartData.get(i - 1);
            DailyStockChart currentDay = dailyChartData.get(i);

            BigDecimal previousClose = previousDay.getClosingPrice();
            BigDecimal currentClose = currentDay.getClosingPrice();

            double changeRate = currentClose.subtract(previousClose)
                    .divide(previousClose, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();

            changeRates.put(currentDay.getDate(), changeRate);
        }

        return changeRates;
    }

    private List<Stock> initializeStocks() {
        List<Stock> allStocks = new ArrayList<>();
        allStocks.addAll(createStocksForMarket("KOSPI200", MarketStocks.KOSPI200));
        allStocks.addAll(createStocksForMarket("KOSPI", MarketStocks.KOSPI));
        allStocks.addAll(createStocksForMarket("KSQ150", MarketStocks.KSQ150));
        allStocks.addAll(createStocksForMarket("KOSDAQ", MarketStocks.KOSDAQ));
        allStocks.addAll(createStocksForMarket("KONEX", MarketStocks.KONEX));
        return allStocks;
    }

    private Collection<? extends Stock> createStocksForMarket(String market, List<String> stocks) {
        return stocks.stream()
                .map(code -> new Stock(code, "회사" + code, market))
                .toList();
    }
}
