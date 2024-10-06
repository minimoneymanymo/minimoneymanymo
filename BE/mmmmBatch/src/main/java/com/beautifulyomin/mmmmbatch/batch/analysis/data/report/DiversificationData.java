package com.beautifulyomin.mmmmbatch.batch.analysis.data.report;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class DiversificationData {
    private int stockHeldCount;

    public int calculateScore() {
        if (stockHeldCount == 0) { //분석 대상 x
            return 0;
        }
        return Math.min(stockHeldCount * 5, 100);
    }

}
