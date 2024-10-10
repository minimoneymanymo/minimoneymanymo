package com.beautifulyomin.mmmm.simulation;

import com.beautifulyomin.mmmm.config.QueryDslConfig;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.entity.DailyStockChart;
import com.beautifulyomin.mmmm.domain.stock.repository.DailyStockChartRepository;
import com.beautifulyomin.mmmm.domain.stock.service.TradeServiceImpl;
import com.beautifulyomin.mmmm.simulation.data.SimulationInvestor;
import com.beautifulyomin.mmmm.simulation.data.MarketStocks;
import com.beautifulyomin.mmmm.simulation.data.SimulationStock;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.IntStream;

@Slf4j
@TestPropertySource(locations = "classpath:application-test.properties")
@SpringBootTest
@Import({QueryDslConfig.class})
public class tradeSimulation {

    private static final LocalDate START_DATE = LocalDate.of(2024, 9, 1);
    private static final LocalDate END_DATE = LocalDate.of(2024, 9, 30);
    private static final int INITIAL_MONEY = 100000;
    private static final int INVESTOR_START_IDX = 58;
    private static final int INVESTOR_COUNT = 1000;

    // 기본 수익 임계값: 이 비율 이상의 수익 시 매도를 고려
    private static final double BASE_PROFIT_THRESHOLD = 0.05;  // 5%

    // 기본 손실 임계값: 이 비율 이상의 손실 시 매도를 고려
    private static final double BASE_LOSS_THRESHOLD = -0.03;   // -3%

    // 시장 타이밍 고려 임계값: 이 값 이상일 때 시장 동향을 거래 결정에 반영
    private static final double MARKET_TIMING_THRESHOLD = 0.5;

    // 시장 영향 계수: 시장 동향이 매도 결정에 미치는 영향의 강도
    private static final double MARKET_IMPACT_FACTOR = 0.5;

    // 최대 보유 기간: 이 기간을 초과하면 매도를 고려 (일 단위)
    private static final int MAX_HOLDING_PERIOD = 30;

    // 최대 포트폴리오 크기: 보유 가능한 최대 주식 종류 수
    private static final int MAX_PORTFOLIO_SIZE = 3;

    // 시장 변화 기준점: 이 값을 기준으로 시장 상승/하락 판단
    // 0.0은 변화 없음을 의미, 양수는 상승, 음수는 하락을 나타냄
    private static final double MARKET_CHANGE_THRESHOLD = 0.0;

    //투자 마지노선 기준
    private static final double MINIMUM_INVESTMENT_AMOUNT = 10000;
    private static final int MAX_DAILY_TRADE_CNT = 5;

    private final TradeServiceImpl tradeService;
    private final DailyStockChartRepository dailyStockChartRepository;

    private List<SimulationInvestor> investors;
    private List<SimulationStock> simulationStocks;

    @Autowired
    public tradeSimulation(TradeServiceImpl tradeService, DailyStockChartRepository dailyStockChartRepository) {
        this.tradeService = tradeService;
        this.dailyStockChartRepository = dailyStockChartRepository;
    }

    @Test
    public void runSimulation() {
        simulationStocks = initializeStocks();
        investors = initializeInvestors();
        loadDailyChangeRates();
        for (LocalDate date = START_DATE; !date.isAfter(END_DATE); date = date.plusDays(1)) { //날짜마다 매수 매도를 진행한다.
            log.info("🚩🚩🚩🚩🚩🚩date={}", date);
            for (SimulationInvestor investor : investors) {
                if (!makeTradingDecisions(investor, date)) {
                    break; //공휴일이면 바로 다음날로 넘어가기
                }
            }
        }

        printSimulationResults();
    }

    private List<SimulationStock> initializeStocks() {
        List<SimulationStock> allSimulationStocks = new ArrayList<>();
        allSimulationStocks.addAll(createStocksForMarket("KOSPI200", MarketStocks.KOSPI200));
        allSimulationStocks.addAll(createStocksForMarket("KOSPI", MarketStocks.KOSPI));
        allSimulationStocks.addAll(createStocksForMarket("KSQ150", MarketStocks.KSQ150));
        allSimulationStocks.addAll(createStocksForMarket("KOSDAQ", MarketStocks.KOSDAQ));
        allSimulationStocks.addAll(createStocksForMarket("KONEX", MarketStocks.KONEX));
        return allSimulationStocks;
    }

    private List<SimulationInvestor> initializeInvestors() {
        return IntStream.range(INVESTOR_START_IDX, INVESTOR_START_IDX + INVESTOR_COUNT)
                .mapToObj(i -> new SimulationInvestor(i, INITIAL_MONEY, generateCharacteristics()))
                .toList();
    }


    private Map<String, Double> generateCharacteristics() {
        Random random = new Random();
        Map<String, Double> characteristics = new HashMap<>();
        characteristics.put("tradingFrequency", generateWeightedRandomValue(random)); //거래 빈도
        characteristics.put("holdingPeriod", generateWeightedRandomValue(random)); //주식 보유 기간
        characteristics.put("cashHoldingRatio", generateWeightedRandomValue(random)); //현금 보유량
        characteristics.put("largeCapPreference", generateWeightedRandomValue(random)); //시장
        characteristics.put("portfolioDiversity", generateWeightedRandomValue(random)); //투자 종목수
        characteristics.put("marketTimingPreference", generateWeightedRandomValue(random)); //상승/하락 시 거래 경향
        characteristics.put("investmentSizeRatio", generateWeightedRandomValue(random)); //투자 규모
        return characteristics;
    }

    //가중치에 대한 확률을 지정해 중간 가중치가 나올 확률을 높인다.
//    private double generateWeightedRandomValue(Random random) {
//        double[] weights = {0.05, 0.1, 0.15, 0.2, 0.3, 0.3, 0.2, 0.15, 0.1, 0.05};
//        double value = random.nextDouble();
//        for (int i = 0; i < weights.length; i++) {
//            if (value < weights[i]) {
//                return (i + 1) / 10.0; // 0.1 to 1.0
//            }
//            value -= weights[i];
//        }
//        return 1.0; // fallback
//    }

    private double generateWeightedRandomValue(Random random) {
        // 평균 0.5, 표준편차 0.2로 설정한 정규분포 사용
        double mean = 0.5;
        double stdDev = 0.2;
        double value = mean + stdDev * random.nextGaussian();

        // 0.1에서 1.0 사이로 값을 제한 (정규 분포 값이 음수거나 1을 초과하지 않게)
        return Math.max(0.1, Math.min(1.0, value));
    }


    //하루에 최대 3개 이상 거래하지 않게
    private boolean makeTradingDecisions(SimulationInvestor investor, LocalDate date) {

        if (!isValidTradingDay(date)) {
            return false;
        }

        int tradeCount = 0;

        // 매도 결정
        for (Map.Entry<String, Integer> holding : new HashMap<>(investor.getStockHoldings()).entrySet()) {
            String stockCode = holding.getKey();
            SimulationStock stock = getStockByCode(stockCode);
            if (shouldSell(investor, stock, date)) {
                executeTrade(investor, stock, false, date);
                tradeCount++;
            }
            if (tradeCount >= MAX_DAILY_TRADE_CNT) {
                break;
            }
        }

        // 매수 결정
        for (SimulationStock stock : simulationStocks) {
            if (shouldBuy(investor, stock, date)) {
                executeTrade(investor, stock, true, date);
                tradeCount++;
            }
            if (tradeCount >= MAX_DAILY_TRADE_CNT) {
                break;
            }
        }

        return true;
    }

    private boolean shouldSell(SimulationInvestor investor, SimulationStock stock, LocalDate date) {
        double profitRate = calculateProfitRate(investor, stock, date);
        int holdingPeriod = calculateHoldingPeriod(investor, stock, date);

        // 투자자 성향을 더 강하게 반영: 손실을 크게 싫어하는 투자자는 일정 손실만으로도 매도하도록
        double riskAversion = 1 - investor.getCharacteristics().get("marketTimingPreference");

        // 손익 기준이 명확하지 않으면 매도하지 않도록
        if (profitRate > BASE_PROFIT_THRESHOLD || profitRate < BASE_LOSS_THRESHOLD) {
            if (Math.random() < riskAversion) {
                return true;
            }
        }

        // 보유 기간에 따른 매도 결정 강화
        if (holdingPeriod > MAX_HOLDING_PERIOD) {
            return true;
        }

        return false;
    }


//    private boolean shouldSell(SimulationInvestor investor, SimulationStock stock, LocalDate date) {
//        Map<String, Double> characteristics = investor.getCharacteristics();
//        double profitRate = calculateProfitRate(investor, stock, date);
//        int holdingPeriod = calculateHoldingPeriod(investor, stock, date);
//
//        // 위험 회피 성향과 시장 타이밍 감도 계산
//        double riskAversion = 1 - characteristics.get("marketTimingPreference");
//        double marketTimingSensitivity = characteristics.get("marketTimingPreference");
//
//        // 기본 수익/손실 기준 설정
//        double profitThreshold = BASE_PROFIT_THRESHOLD * (2 - riskAversion);
//        double lossThreshold = BASE_LOSS_THRESHOLD * riskAversion;
//
//        // 시장 타이밍 감도가 높은 경우 시장 동향 반영
//        if (marketTimingSensitivity > MARKET_TIMING_THRESHOLD) {
//            double marketTrend = analyzeMarketTrend(stock.getMarket(), date);
//            double marketImpact = MARKET_IMPACT_FACTOR * marketTimingSensitivity;
//            profitThreshold += marketTrend * marketImpact;
//            lossThreshold += marketTrend * marketImpact;
//        }
//
//        // 수익률에 따른 매도 결정
//        if ((profitRate > profitThreshold && Math.random() < riskAversion) ||
//                (profitRate < lossThreshold && Math.random() < (2 - riskAversion))) {
//            return true;
//        }
//
//        // 보유 기간에 따른 매도 결정
//        double holdingPeriodPreference = characteristics.get("holdingPeriod");
//        if (holdingPeriod > MAX_HOLDING_PERIOD && Math.random() > holdingPeriodPreference) {
//            return true;
//        }
//
//        return false;
//    }

    private int calculateHoldingPeriod(SimulationInvestor investor, SimulationStock stock, LocalDate date) {
        return investor.calculateHoldingPeriod(stock.getStockCode(), date);
    }

    private double analyzeMarketTrend(String market, LocalDate date) {
        // 해당 시장의 모든 주식의 평균 변동률 계산
        return simulationStocks.stream()
                .filter(s -> s.getMarket().equals(market))
                .mapToDouble(s -> s.getDailyChangeRates().getOrDefault(date, 0.0))
                .average()
                .orElse(0.0);
    }

    private double calculateProfitRate(SimulationInvestor investor, SimulationStock stock, LocalDate date) {
        Integer boughtShares = investor.getStockHoldings().get(stock.getStockCode());
        if (boughtShares == null || boughtShares == 0) {
            return 0.0;
        }

        double currentPrice = stock.getDailyClosingPrices().get(date);
        double averageBuyPrice = investor.getAverageBuyPrice(stock.getStockCode());

        return (currentPrice - averageBuyPrice) / averageBuyPrice;
    }

    private void executeTrade(SimulationInvestor investor, SimulationStock stock, boolean isBuy, LocalDate date) {
        TradeDto tradeDto = isBuy ? createBuyTradeDto(investor, stock, date) : createSellTradeDto(investor, stock, date);

        if (tradeDto == null) {
            System.out.println("Trade not executed for " + (isBuy ? "buy" : "sell") + " on " + date + " for stock " + stock.getStockCode());
            return;
        }

        try {
            tradeService.createTradeByDate(tradeDto, investor.getId(), date);
            updateInvestorAfterTrade(investor, tradeDto);

            // 거래 기록 추가
            double pricePerShare = (double) tradeDto.getAmount() / tradeDto.getTradeSharesCount().doubleValue();
            investor.addTransaction(tradeDto.getStockCode(), isBuy, tradeDto.getTradeSharesCount().intValue(), pricePerShare, date);

            System.out.println("Trade executed: " + (isBuy ? "Buy" : "Sell") + " " + tradeDto.getTradeSharesCount() + " shares of " + tradeDto.getStockCode());
        } catch (IllegalArgumentException e) {
            System.err.println("Failed to execute trade: " + e.getMessage());
        }
    }

    private boolean isValidTradingDay(LocalDate date) {
        return simulationStocks.get(0).getDailyClosingPrices().containsKey(date);
    }

    private boolean shouldBuy(SimulationInvestor investor, SimulationStock stock, LocalDate date) {
        Map<String, Double> characteristics = investor.getCharacteristics();

        // 현재 자금이 충분하지 않으면 매수를 고려하지 않음
        if (investor.getMoney() < MINIMUM_INVESTMENT_AMOUNT) {
            return false;
        }

        // 거래 빈도에 따라 매수 여부 결정
        if (Math.random() > investor.getCharacteristics().get("tradingFrequency")) {
            return false;
        }

        // 주식 보유 기간
        if (investor.getStockHoldings().containsKey(stock.getStockCode())) {
            double holdingPeriodPreference = characteristics.get("holdingPeriod");
            if (Math.random() < holdingPeriodPreference) {
                return false;  // 보유 선호도가 높으면 거래하지 않을 확률이 높아짐
            }
        }

        // 대형주/소형주 선호도
        double largeCapPreference = characteristics.get("largeCapPreference");
        boolean isLargeCap = isLargeCapStock(stock);
        if ((isLargeCap && Math.random() > largeCapPreference) || (!isLargeCap && Math.random() < largeCapPreference)) {
            return false;
        }

        // 포트폴리오 다양성
        double diversityPreference = characteristics.get("portfolioDiversity");
        int currentStockTypes = investor.getStockHoldings().size();
        if (currentStockTypes > MAX_PORTFOLIO_SIZE && Math.random() > diversityPreference) {
            return false;  // 이미 다양한 주식을 보유 중이고, 다양성 선호도가 낮으면 새로운 거래를 하지 않을 확률이 높아짐
        }

        // 시장 타이밍
        double marketTimingPreference = characteristics.get("marketTimingPreference");
        double currentChangeRate = stock.getDailyChangeRates().getOrDefault(date, 0.0);
        boolean isMarketUp = currentChangeRate > MARKET_CHANGE_THRESHOLD;
        if ((isMarketUp && Math.random() > marketTimingPreference) ||
                (!isMarketUp && Math.random() < marketTimingPreference)) {
            return false;
        }

        return true;
    }

    private TradeDto createBuyTradeDto(SimulationInvestor investor, SimulationStock stock, LocalDate date) {
        BigDecimal amount = calculateTradeAmount(investor, stock, true, date);
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }

        BigDecimal shareCount = calculateShareCount(amount, stock, date);
        if (shareCount.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }

        return TradeDto.builder()
                .stockCode(stock.getStockCode())
                .amount(amount.intValue())
                .tradeSharesCount(shareCount)
                .reason("Simulation Buy")
                .tradeType("4") // 4: 매수
                .build();
    }

    private TradeDto createSellTradeDto(SimulationInvestor investor, SimulationStock stock, LocalDate date) {
        int currentHoldings = investor.getStockHoldings().getOrDefault(stock.getStockCode(), 0);
        if (currentHoldings == 0) {
            return null;
        }

        BigDecimal currentPrice = BigDecimal.valueOf(stock.getDailyClosingPrices().get(date));
        int sharesToSell = (Math.random() < 0.3) ? currentHoldings : currentHoldings / 2;
        if (sharesToSell == 0) {
            return null;
        }

        BigDecimal amount = currentPrice.multiply(BigDecimal.valueOf(sharesToSell));

        return TradeDto.builder()
                .stockCode(stock.getStockCode())
                .amount(amount.intValue())
                .tradeSharesCount(BigDecimal.valueOf(sharesToSell))
                .reason("Simulation Sell")
                .tradeType("5") // 5: 매도
                .build();
    }

    private SimulationStock getStockByCode(String stockCode) {
        return simulationStocks.stream()
                .filter(s -> s.getStockCode().equals(stockCode))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Stock not found: " + stockCode));
    }


    private BigDecimal calculateTradeAmount(SimulationInvestor investor, SimulationStock stock, boolean isBuy, LocalDate date) {
        BigDecimal investmentSizeRatio = BigDecimal.valueOf(investor.getCharacteristics().get("investmentSizeRatio"));
        BigDecimal cash = BigDecimal.valueOf(investor.getMoney());
        BigDecimal stockValue = BigDecimal.valueOf(calculateTotalStockValue(investor, date));
        BigDecimal totalAssets = cash.add(stockValue);

        BigDecimal baseTradeAmount = totalAssets.multiply(investmentSizeRatio);

        if (isBuy) {
            return baseTradeAmount.min(cash); // 매수: 현재 보유 현금을 초과하지 않도록 함
        } else {
            return baseTradeAmount.min(stockValue); // 매도: 현재 보유 주식 가치를 초과하지 않도록 함
        }
    }

    //주어진 금액으로 구매할 수 있는 주식의 수량 구하기
    private BigDecimal calculateShareCount(BigDecimal amount, SimulationStock simulationStock, LocalDate date) {
        BigDecimal currentPrice = BigDecimal.valueOf(simulationStock.getDailyClosingPrices().get(date));
        return amount.divide(currentPrice, 4, RoundingMode.DOWN);
    }

    private void updateInvestorAfterTrade(SimulationInvestor investor, TradeDto tradeDto) {
        if (tradeDto.getTradeType().equals("4")) { // 매수
            investor.setMoney(investor.getMoney() - tradeDto.getAmount());
            investor.getStockHoldings().merge(tradeDto.getStockCode(),
                    tradeDto.getTradeSharesCount().intValue(), Integer::sum);
        } else { // 매도
            investor.setMoney(investor.getMoney() + tradeDto.getAmount());
            investor.getStockHoldings().merge(tradeDto.getStockCode(),
                    -tradeDto.getTradeSharesCount().intValue(), Integer::sum);
        }
    }

    private void loadDailyChangeRates() {
        for (SimulationStock simulationStock : simulationStocks) {
            List<DailyStockChart> dailyChartData = dailyStockChartRepository
                    .findByStockCodeAndDateBetweenOrderByDateAsc(simulationStock.getStockCode(), START_DATE, END_DATE);
            log.info("Loaded data for {}: {}", simulationStock.getStockCode(), dailyChartData.size());
            calculateAndStoreDailyData(simulationStock, dailyChartData);
        }
    }

    private boolean decideBuyOrSell(SimulationInvestor investor, SimulationStock simulationStock, LocalDate date) {
        // 현금 보유량에 따른 결정
        double cashHoldingRatio = investor.getCharacteristics().get("cashHoldingRatio");
        double currentCashRatio = investor.getMoney() / (investor.getMoney() + calculateTotalStockValue(investor, date));

        if (currentCashRatio < cashHoldingRatio) {
            return false;  // 매도 선호
        } else {
            return true;   // 매수 선호
        }
    }

    private double calculateTotalStockValue(SimulationInvestor investor, LocalDate date) {
        return investor.getStockHoldings().entrySet().stream()
                .mapToDouble(entry -> {
                    SimulationStock simulationStock = simulationStocks.stream()
                            .filter(s -> s.getStockCode().equals(entry.getKey()))
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("Stock not found"));
                    return entry.getValue() * simulationStock.getDailyClosingPrices().get(date);
                })
                .sum();
    }

    private boolean isLargeCapStock(SimulationStock simulationStock) {
        return simulationStock.getMarket().contains("KOSPI200") || simulationStock.getMarket().equals("KOSPI");
    }

    //daily_stock_data에는 데이터가 부족해서 차트데이터로 하나하나 등락률 계산
    private void calculateAndStoreDailyData(SimulationStock simulationStock, List<DailyStockChart> dailyChartData) {
        for (int i = 0; i < dailyChartData.size(); i++) {
            DailyStockChart currentDay = dailyChartData.get(i);
            LocalDate currentDate = currentDay.getDate();
            BigDecimal currentClose = currentDay.getClosingPrice();

            int closingPrice = currentClose.intValue();
            double changeRate = 0.0;

            if (i > 0) {
                DailyStockChart previousDay = dailyChartData.get(i - 1);
                BigDecimal previousClose = previousDay.getClosingPrice();

                changeRate = currentClose.subtract(previousClose)
                        .divide(previousClose, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();
            }
            simulationStock.addDailyData(currentDate, closingPrice, changeRate);
        }
    }


    private Collection<? extends SimulationStock> createStocksForMarket(String market, List<String> stocks) {
        return stocks.stream()
                .map(code -> new SimulationStock(code, "회사" + code, market))
                .toList();
    }

    private void printSimulationResults() {
        for (SimulationInvestor investor : investors) {
            System.out.println("Investor " + investor.getId() + ": Final money = " + investor.getMoney());
        }
    }
}
