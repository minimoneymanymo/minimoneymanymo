package com.beautifulyomin.mmmmbatch.stock.entity;

import com.beautifulyomin.mmmmbatch.stock.entity.key.DailyStockDataId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.BigInteger;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class DailyStockData {

    @EmbeddedId
    private DailyStockDataId id;

    @Column(nullable = false)
    private BigInteger marketCapitalization;

    @Column(nullable = false, length = 1)
    private char priceChangeSign;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal priceChange;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal priceChangeRate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal peRatio;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pbRatio;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal earningsPerShare;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal bookValuePerShare;

    @Column(nullable = false, length = 12)
    private String foreignNetBuyVolume;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal htsForeignExhaustionRate;

    @Column(nullable = false, length = 12)
    private String programNetBuyVolume;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal volumeTurnoverRatio;

    @Column(nullable = false)
    private BigInteger tradingValue;

    @Column(nullable = false)
    private BigInteger outstandingShares;

}
