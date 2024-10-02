package com.beautifulyomin.mmmmbatch.batch.analysis.data.report;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@ToString
@AllArgsConstructor
@RequiredArgsConstructor
public class TradingFrequencyData {
    private long tradingCount;

    public int calculateScore() {
        if(tradingCount==0){ //분석 대상 x
            return 0;
        }
        if (this.tradingCount < 5) {
            return 10;
        }
        if (this.tradingCount < 15) {
            return 20;
        }
        if (this.tradingCount < 30) {
            return 40;
        }
        if (this.tradingCount < 50) {
            return 60;
        }
        if (this.tradingCount < 75) {
            return 80;
        }
        return 100; //100이상이여도 전부 100
    }
}
