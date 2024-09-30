package com.beautifulyomin.mmmmbatch.batch.analysis.vo;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class DiversificationData {
    private int stockHeldCount;

    public int calculateScore() {
        if (stockHeldCount == 0) { //분석 대상 x
            return 0;
        }
        if (this.stockHeldCount * 10 > 100) {
            return 100;
        }
        return this.stockHeldCount * 10;
    }

}
