package com.beautifulyomin.mmmm.domain.stock.dto.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DailyStockDataDto {
    private String stockCode;
    private LocalDate date;

    private BigInteger marketCapitalization;

    private String priceChangeSign;

    private BigDecimal priceChange;

    private BigDecimal priceChangeRate;

    private BigDecimal peRatio;

    private BigDecimal pbRatio;

    private BigDecimal earningsPerShare;

    private BigDecimal bookValuePerShare;

    private String foreignNetBuyVolume;

    private BigDecimal htsForeignExhaustionRate;

    private String programNetBuyVolume;

    private BigDecimal volumeTurnoverRatio;

    private BigInteger tradingValue;

    private BigInteger outstandingShares;

    private Long high52Week;

    private LocalDate high52WeekDate;

    private Long low52Week;

    private LocalDate low52WeekDate;

    public DailyStockDataDto(String stockCode,LocalDate date, BigInteger marketCapitalization, String priceChangeSign
            , BigDecimal priceChange, BigDecimal priceChangeRate, BigDecimal peRatio, BigDecimal pbRatio
            , BigDecimal earningsPerShare, BigDecimal bookValuePerShare, String foreignNetBuyVolume
            , BigDecimal htsForeignExhaustionRate, String programNetBuyVolume, BigDecimal volumeTurnoverRatio
            , BigInteger tradingValue, BigInteger outstandingShares) {
        this.stockCode = stockCode;
        this.date=date;
        this.marketCapitalization = marketCapitalization;
        this.priceChangeSign = priceChangeSign;
        this.priceChange = priceChange;
        this.priceChangeRate = priceChangeRate;
        this.peRatio = peRatio;
        this.pbRatio = pbRatio;
        this.earningsPerShare = earningsPerShare;
        this.bookValuePerShare = bookValuePerShare;
        this.foreignNetBuyVolume = foreignNetBuyVolume;
        this.htsForeignExhaustionRate = htsForeignExhaustionRate;
        this.programNetBuyVolume = programNetBuyVolume;
        this.volumeTurnoverRatio = volumeTurnoverRatio;
        this.tradingValue = tradingValue;
        this.outstandingShares = outstandingShares;
    }
}
