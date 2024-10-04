package com.beautifulyomin.mmmm.simulation;

import com.amazonaws.services.kms.model.NotFoundException;
import com.beautifulyomin.mmmm.config.QueryDslConfig;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.entity.DailyStockChart;
import com.beautifulyomin.mmmm.domain.stock.repository.DailyStockChartRepository;
import com.beautifulyomin.mmmm.domain.stock.service.TradeServiceImpl;
import com.beautifulyomin.mmmm.simulation.data.SimulationInvestor;
import com.beautifulyomin.mmmm.simulation.data.MarketStocks;
import com.beautifulyomin.mmmm.simulation.data.SimulationStock;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@TestPropertySource(locations = "classpath:application-test.properties")
@SpringBootTest
@Import({QueryDslConfig.class})
public class tradeSimulation {

    private static final LocalDate START_DATE = LocalDate.of(2024, 9, 1);
    private static final LocalDate END_DATE = LocalDate.of(2024, 9, 30);
    private static final int INITIAL_MONEY = 100000;
    private static final int INVESTOR_START_IDX = 697;
    private static final int INVESTOR_COUNT = 300;

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
    public void test() {
        System.out.println(Math.random()); //0~1 값
    }

    @Test
    public void runSimulation() {
        simulationStocks = initializeStocks();
        investors = initializeInvestors();
        loadDailyChangeRates();
        for (LocalDate date = START_DATE; !date.isAfter(END_DATE); date = date.plusDays(1)) { //날짜마다 매수 매도를 진행한다.
            for (SimulationInvestor investor : investors) {
                makeTradingDecisions(investor, date);
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
                .collect(Collectors.toList());
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
    private double generateWeightedRandomValue(Random random) {
        double[] weights = {0.05, 0.1, 0.15, 0.2, 0.3, 0.3, 0.2, 0.15, 0.1, 0.05};
        double value = random.nextDouble();
        for (int i = 0; i < weights.length; i++) {
            if (value < weights[i]) {
                return (i + 1) / 10.0; // 0.1 to 1.0
            }
            value -= weights[i];
        }
        return 1.0; // fallback
    }


    private void makeTradingDecisions(SimulationInvestor investor, LocalDate date) {
        if (!isValidTradingDay(date)) {
            System.out.println("이 날짜는 주말 또는 공휴일이기 때문에, 거래가 되지 않았습니다: " + date);
            return;
        }

        for (SimulationStock simulationStock : simulationStocks) { //그 날짜에, 전체 주식에 대해 살지 말지를 본다.
            if (shouldTrade(investor, simulationStock, date)) {
                TradeDto tradeDto = createTradeDto(investor, simulationStock, date);
                if (tradeDto == null) { //거래가 이루어지지 않음
                    continue;
                }
                try {
                    tradeService.createTradeByDate(tradeDto, investor.getId(), date);
                    updateInvestorAfterTrade(investor, tradeDto);
                } catch (IllegalArgumentException e) {
                    // 거래 실패 처리
                    e.printStackTrace();
                }
            }
        }
    }

    private boolean isValidTradingDay(LocalDate date) {
        return simulationStocks.get(0).getDailyClosingPrices().containsKey(date);
    }

    private boolean shouldTrade(SimulationInvestor investor, SimulationStock simulationStock, LocalDate date) {
        Map<String, Double> characteristics = investor.getCharacteristics();

        // 거래 빈도
        double tradeChance = characteristics.get("tradingFrequency");
        if (Math.random() > tradeChance) {
            return false;
        }

        // 주식 보유 기간
        if (investor.getStockHoldings().containsKey(simulationStock.getStockCode())) {
            double holdingPeriodPreference = characteristics.get("holdingPeriod");
            if (Math.random() < holdingPeriodPreference) {
                return false;  // 보유 선호도가 높으면 거래하지 않을 확률이 높아짐
            }
        }

        // 대형주/소형주 선호도
        double largeCapPreference = characteristics.get("largeCapPreference");
        boolean isLargeCap = isLargeCapStock(simulationStock);
        if ((isLargeCap && Math.random() > largeCapPreference) || (!isLargeCap && Math.random() < largeCapPreference)) {
            return false;
        }

        // 포트폴리오 다양성
        double diversityPreference = characteristics.get("portfolioDiversity");
        int currentStockTypes = investor.getStockHoldings().size();
        if (currentStockTypes > 5 && Math.random() > diversityPreference) {
            return false;  // 이미 다양한 주식을 보유 중이고, 다양성 선호도가 낮으면 새로운 거래를 하지 않을 확률이 높아짐
        }

        // 시장 타이밍
        double marketTimingPreference = characteristics.get("marketTimingPreference");
        double currentChangeRate = simulationStock.getDailyChangeRates().getOrDefault(date, 0d);
        if ((currentChangeRate > 0 && Math.random() > marketTimingPreference) ||
                (currentChangeRate < 0 && Math.random() < marketTimingPreference)) {
            return false;
        }

        return true;
    }

    private TradeDto createTradeDto(SimulationInvestor investor, SimulationStock simulationStock, LocalDate date) {
        boolean isBuy = decideBuyOrSell(investor, simulationStock, date);
        if (!isBuy && !investor.getStockHoldings().containsKey(simulationStock.getStockCode())) {
            return null;
        }

        BigDecimal amount = calculateTradeAmount(investor, simulationStock, isBuy, date);
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }

        if (isBuy && amount.compareTo(BigDecimal.valueOf(investor.getMoney())) > 0) {
            amount = BigDecimal.valueOf(investor.getMoney());
        }

        BigDecimal shareCount = calculateShareCount(amount, simulationStock, date);

        // 매도의 경우, 보유 주식 수를 초과하지 않도록 조정
        if (!isBuy) {
            BigDecimal currentHoldings = BigDecimal.valueOf(investor.getStockHoldings().getOrDefault(simulationStock.getStockCode(), 0));
            if (shareCount.compareTo(currentHoldings) > 0) {
                shareCount = currentHoldings;
                amount = shareCount.multiply(BigDecimal.valueOf(simulationStock.getDailyClosingPrices().get(date)));
            }
        }

        return TradeDto.builder()
                .stockCode(simulationStock.getStockCode())
                .amount(amount.intValue())
                .tradeSharesCount(shareCount)
                .reason("Simulation Trade")
                .tradeType(isBuy ? "4" : "5") // 4: 매수, 5: 매도
                .build();
    }

    private BigDecimal calculateTradeAmount(SimulationInvestor investor, SimulationStock simulationStock, boolean isBuy, LocalDate date) {
        double investmentSizeRatio = investor.getCharacteristics().get("investmentSizeRatio");
        double cashHoldingRatio = investor.getCharacteristics().get("cashHoldingRatio");

        BigDecimal totalAssets = BigDecimal.valueOf(investor.getMoney()).add(new BigDecimal(calculateTotalStockValue(investor, date)));
        BigDecimal currentCashRatio = BigDecimal.valueOf(investor.getMoney()).divide(totalAssets, 4, RoundingMode.HALF_UP);

        if (isBuy) {
            // 매수: 현금 비율이 목표 현금 보유 비율보다 높을 때만 매수
            if (currentCashRatio.compareTo(BigDecimal.valueOf(cashHoldingRatio)) > 0) {
                BigDecimal excessCash = totalAssets.multiply(currentCashRatio.subtract(BigDecimal.valueOf(cashHoldingRatio)));
                BigDecimal maxBuyAmount = BigDecimal.valueOf(investor.getMoney()).multiply(BigDecimal.valueOf(investmentSizeRatio));
                return excessCash.min(maxBuyAmount);
            }
        } else {
            // 매도: 현금 비율이 목표 현금 보유 비율보다 낮을 때만 매도
            if (currentCashRatio.compareTo(BigDecimal.valueOf(cashHoldingRatio)) < 0) {
                BigDecimal cashNeeded = totalAssets.multiply(BigDecimal.valueOf(cashHoldingRatio).subtract(currentCashRatio));
                return cashNeeded.multiply(BigDecimal.valueOf(investmentSizeRatio));
            }
        }

        return BigDecimal.ZERO;
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
        return simulationStock.getMarket().equals("KOSPI200") || simulationStock.getMarket().equals("KOSPI");
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
