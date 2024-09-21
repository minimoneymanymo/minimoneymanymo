package com.beautifulyomin.mmmm.domain.stock.constant;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public enum MarketCapSize {
    SMALL("S", new BigDecimal("0"), new BigDecimal("300_000_000_000")),
    MEDIUM("M", new BigDecimal("300_000_000_001"), new BigDecimal("1_000_000_000_000")),
    LARGE("B", new BigDecimal("1_000_000_000_001"), new BigDecimal(Long.MAX_VALUE));

    private final String label;
    private final BigDecimal minCap;
    private final BigDecimal maxCap;

    MarketCapSize(String label, BigDecimal minCap, BigDecimal maxCap) {
        this.label = label;
        this.minCap = minCap;
        this.maxCap = maxCap;
    }

    public static MarketCapSize fromLabel(String label) {
        for (MarketCapSize size : values()) {
            if (size.label.equals(label)) {
                return size;
            }
        }
        throw new IllegalArgumentException("올바르지 않은 시가 총액 필터 기준입니다.");
    }
}
