package com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReport;
import lombok.Data;
import org.apache.commons.math3.ml.clustering.Clusterable;

@Data
public class InvestorPoint implements Clusterable {
    private double[] point;
    private Integer childrenId;

    public InvestorPoint(InvestmentReport report) {
        this.childrenId = report.getChildrenId();
        this.point = new double[]{
                report.getTradingFrequency(),
                report.getCashRatio().doubleValue(),
                report.getWinLossRatio().doubleValue(),
                report.getDiversification(),
                report.getStability()
        };
    }

}
