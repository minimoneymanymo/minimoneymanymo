package com.beautifulyomin.mmmmbatch.batch.entity;

import com.beautifulyomin.mmmmbatch.batch.entity.key.DailyStockDataId;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@IdClass(DailyStockDataId.class)
public class DailyStockData {

    @Id
    @Column(nullable = false)
    private String stockCode;

    @Id
    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private BigInteger marketCapitalization;

    @Column(nullable = false, length = 1)
    private String priceChangeSign;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stockCode", insertable = false, updatable = false)
    private Stock stock;

    // 값이 없으면 기본값으로 설정하기
    @PrePersist
    public void prePersist() {
        if (marketCapitalization == null) marketCapitalization = BigInteger.ZERO;
        if (priceChangeSign == null) priceChangeSign = "0";
        if (priceChange == null) priceChange = BigDecimal.ZERO;
        if (priceChangeRate == null) priceChangeRate = BigDecimal.ZERO;
        if (peRatio == null) peRatio = BigDecimal.ZERO;
        if (pbRatio == null) pbRatio = BigDecimal.ZERO;
        if (earningsPerShare == null) earningsPerShare = BigDecimal.ZERO;
        if (bookValuePerShare == null) bookValuePerShare = BigDecimal.ZERO;
        if (foreignNetBuyVolume == null) foreignNetBuyVolume = "0";
        if (htsForeignExhaustionRate == null) htsForeignExhaustionRate = BigDecimal.ZERO;
        if (programNetBuyVolume == null) programNetBuyVolume = "0";
        if (volumeTurnoverRatio == null) volumeTurnoverRatio = BigDecimal.ZERO;
        if (tradingValue == null) tradingValue = BigInteger.ZERO;
        if (outstandingShares == null) outstandingShares = BigInteger.ZERO;
    }

}
