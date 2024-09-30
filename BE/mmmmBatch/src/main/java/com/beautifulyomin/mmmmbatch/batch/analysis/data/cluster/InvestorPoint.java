package com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster;

import lombok.Data;
import lombok.Getter;
import org.apache.commons.math3.ml.clustering.Clusterable;

@Data
public class InvestorPoint implements Clusterable {
    private double[] point;
    private Integer childrenId;

    public InvestorPoint(InvestorData data) {
        this.childrenId = data.getChildrenId();
        this.point = new double[]{
                data.getTradingFrequency(),
                data.getCashRatio(),
                data.getWinLossRatio(),
                data.getDiversification(),
                data.getStability()
        };
    }
}
