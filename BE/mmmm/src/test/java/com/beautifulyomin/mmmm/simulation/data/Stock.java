package com.beautifulyomin.mmmm.simulation.data;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@RequiredArgsConstructor
@Data
public class Stock {

    private String stockCode;
    private String companyName;
    private String market;
    private Map<LocalDate, Double> dailyChangeRates;

    public Stock(String stockCode, String companyName, String market) {
        this.stockCode = stockCode;
        this.companyName = companyName;
        this.market = market;
    }
}
