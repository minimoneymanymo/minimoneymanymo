package com.beautifulyomin.mmmmbatch.batch.analysis.data.report;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class CashData {
    private int myMoney; //놀고 있는 머니
    private int totalHoldingMarketAmount; //평가금 총합

    public double calculateCashRatio() {
        if (this.myMoney == 0 && this.totalHoldingMarketAmount == 0) {
            return 0.0; //처음부터 투자할 돈이 없었던 자녀 -> 분석 대상 x -> 0
        }
        if (this.totalHoldingMarketAmount == 0) { // 현금은 있고 평가금만 !=0 이면 현금 비중 100%
            return 100.0;
        }
        double ratio = (double) (this.myMoney * 100) / (this.myMoney + this.totalHoldingMarketAmount);
        return Math.round(ratio * 100) / 100.0;
    }

    public double getNotCashRatio() {
        if (this.myMoney == 0 && this.totalHoldingMarketAmount == 0) {
            return 0.0; //처음부터 투자할 돈이 없었던 자녀 -> 분석 대상 x -> 0
        }
        return Math.round((100.0 - calculateCashRatio()) * 100) / 100.0;
    }
}
