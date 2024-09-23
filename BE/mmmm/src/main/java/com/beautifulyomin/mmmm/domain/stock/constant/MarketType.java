package com.beautifulyomin.mmmm.domain.stock.constant;

import com.beautifulyomin.mmmm.domain.stock.exception.InvalidFilterTypeException;
import lombok.Getter;

@Getter
public enum MarketType {
    KOSDAQ("KOSDAQ", "KOSDAQ"),
    KOSPI("KOSPI", "KOSPI"),
    KOSPI200("KOSPI200", "KOSPI200"),
    KSQ150("KSQ150", "KSQ150"),
    KONEX("KONEX", "KONEX");

    private final String label;

    private final String type;

    MarketType(String label, String type) {
        this.label = label;
        this.type = type;
    }

    public static MarketType fromType(String label) {
        for (MarketType marketType : values()) {
            if (marketType.label.equals(label)) {
                return marketType;
            }
        }
        throw new InvalidFilterTypeException("올바르지 않은 시장 타입입니다.");
    }
}
