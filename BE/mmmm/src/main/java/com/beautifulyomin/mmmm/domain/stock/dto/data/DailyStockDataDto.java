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
}
