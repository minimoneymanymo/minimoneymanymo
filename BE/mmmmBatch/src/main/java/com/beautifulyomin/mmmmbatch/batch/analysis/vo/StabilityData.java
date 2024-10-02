package com.beautifulyomin.mmmmbatch.batch.analysis.vo;

import com.beautifulyomin.mmmmbatch.batch.analysis.constant.MarketType;

import java.util.List;

public class StabilityData {
    private List<String> marketTypesOfHeldStock;

    public StabilityData(List<String> marketTypesOfHeldStock) {
        this.marketTypesOfHeldStock = marketTypesOfHeldStock;
    }

    public Integer calculateScore() {
        if(marketTypesOfHeldStock.isEmpty()){ //분석 대상 x
            return 0;
        }
        int score = 0;
        for (String marketTypeLabel : marketTypesOfHeldStock) {
            score += MarketType.fromLabel(marketTypeLabel).getWeight();
        }
        return score/marketTypesOfHeldStock.size();
    }
}
