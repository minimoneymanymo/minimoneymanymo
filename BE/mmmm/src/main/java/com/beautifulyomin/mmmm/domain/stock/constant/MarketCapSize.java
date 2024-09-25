package com.beautifulyomin.mmmm.domain.stock.constant;

import com.beautifulyomin.mmmm.domain.stock.exception.InvalidFilterTypeException;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public enum MarketCapSize {
    SMALL("SMALL", "0", "300000000000"), //3000억원 미만
    MEDIUM("MIDIUM", "300000000001", "1000000000000"), //1조원 미만
    LARGE("LARGE", "1000000000001", "9223372036854775807"); //1조원 이상

    private final String label;
    private final String minCap;
    private final String maxCap;

    MarketCapSize(String label, String minCap, String maxCap) {
        this.label = label;
        this.minCap = String.valueOf(minCap);
        this.maxCap = String.valueOf(maxCap);
    }

    public static MarketCapSize fromLabel(String label) {
        for (MarketCapSize size : values()) {
            if (size.label.equals(label)) {
                return size;
            }
        }
        throw new InvalidFilterTypeException("올바르지 않은 시가 총액 필터 기준입니다.");
    }

    public BigDecimal getMinCapAsBigDecimal() {
        return new BigDecimal(minCap);
    }

    public BigDecimal getMaxCapAsBigDecimal() {
        return new BigDecimal(maxCap);
    }
}
