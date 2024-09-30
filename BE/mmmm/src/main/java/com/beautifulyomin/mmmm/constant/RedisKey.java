package com.beautifulyomin.mmmm.constant;

import lombok.Getter;

@Getter
public enum RedisKey {
    DAILY_STOCK_DATA("dailyStockData::%s"),
    DAILY_STOCK_CHARTS("dailyStockCharts::%s"),
    WEEKLY_STOCK_CHARTS("weeklyStockCharts::%s"),
    MONTHLY_STOCK_CHARTS("monthlyStockCharts::%s"),
    OVERALL_STATISTICS("overallStatistics::%s");

    private final String keyPattern;

    RedisKey(String keyPattern) {
        this.keyPattern = keyPattern;
    }

    public String format(Object... params) {
        return String.format(keyPattern, params);
    }
}
