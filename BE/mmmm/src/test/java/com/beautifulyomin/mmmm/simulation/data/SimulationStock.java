package com.beautifulyomin.mmmm.simulation.data;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Data
public class SimulationStock {

    private String stockCode;
    private String companyName;
    private String market;
    private Map<LocalDate, Integer> dailyClosingPrices;
    private Map<LocalDate, Double> dailyChangeRates;

    public SimulationStock(String stockCode, String companyName, String market) {
        this.stockCode = stockCode;
        this.companyName = companyName;
        this.market = market;
        dailyClosingPrices= new HashMap<>();
        dailyChangeRates= new HashMap<>();
    }

    public void addDailyData(LocalDate currentDate, int closingPrice, double changeRate) {
        dailyClosingPrices.put(currentDate, closingPrice);
        dailyChangeRates.put(currentDate, changeRate);
    }
}
