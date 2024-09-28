package com.beautifulyomin.mmmmbatch.batch.analysis.vo;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class CashData {
    private int myMoney; //놀고 있는 머니
    private int totalHoldingMarketAmount; //평가금 총합

    public double getCashRatio() {
        if (this.myMoney == 0 && this.totalHoldingMarketAmount == 0) {
            return 100.0; //투자를 안한 건 보유 머니가 어찌 되었든 현금 비중이 0이다. -> 공격적 성향 x
        }
        if (this.totalHoldingMarketAmount == 0) {
            return 100.0;
        }
        double ratio = (double) (this.myMoney * 100) / (this.myMoney + this.totalHoldingMarketAmount);
        return Math.round(ratio * 100) / 100.0;
    }

    public double getNotCashRatio() {
        return Math.round((100.0 - getCashRatio()) * 100) / 100.0;
    }
}
