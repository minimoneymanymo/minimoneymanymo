package com.beautifulyomin.mmmm.domain.stock.constant;

import lombok.Getter;

@Getter
public enum SortCriteria {
    MARKET_CAPITALIZATION("MC", "marketCapitalization"),
    TRADING_VOLUME("TV", "tradingValue");


    private final String label;
    private final String dbField;

    SortCriteria(String label, String dbField) {
        this.label = label;
        this.dbField = dbField;
    }

    public static SortCriteria fromValue(String label) {
        for (SortCriteria size : values()) {
            if (size.label.equals(label)) {
                return size;
            }
        }
        throw new IllegalArgumentException("유효하지 않은 정렬 기준입니다.");
    }
}
