package com.beautifulyomin.mmmmbatch.batch.analysis.constant;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum MarketType {
    KOSPI200("KOSPI200", 100),
    KOSPI("KOSPI", 80),
    KSQ150("KSQ150", 60),
    KOSDAQ("KOSDAQ", 40),
    KONEX("KONEX", 20),
    NONE("NONE",0);

    private final String label;

    private final Integer weight;

    MarketType(String label, Integer weight) {
        this.label = label;
        this.weight = weight;
    }

    public static MarketType fromLabel(String label) {
        return Arrays.stream(MarketType.values())
                .filter(marketType -> marketType.label.equals(label))
                .findFirst()
                .orElse(NONE);
    }

}
