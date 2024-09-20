package com.beautifulyomin.mmmm.domain.stock.constant;

import lombok.Getter;

@Getter
public enum PeriodType {
    WEEK("week", "(7 * 24 * 60 * 60)"),
    MONTH("month", "(30 * 24 * 60 * 60)");

    private final String dateTruncUnit;
    private final String periodDivision;

    PeriodType(String dateTruncUnit, String periodDivision) {
        this.dateTruncUnit = dateTruncUnit;
        this.periodDivision = periodDivision;
    }
}
