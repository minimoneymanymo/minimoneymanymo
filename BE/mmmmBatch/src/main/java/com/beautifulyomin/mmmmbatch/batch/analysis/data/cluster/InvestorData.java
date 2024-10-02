package com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReport;
import lombok.Data;

@Data
public class InvestorData {
    private Integer childrenId;
    private int tradingFrequency;
    private double cashRatio;
    private double winLossRatio;
    private int diversification;
    private int stability;

    public static InvestorData fromInvestmentReport(InvestmentReport report) {
        InvestorData data = new InvestorData();
        data.setChildrenId(report.getChildrenId());
        data.setTradingFrequency(report.getTradingFrequency());
        data.setCashRatio(report.getCashRatio().doubleValue());
        data.setWinLossRatio(report.getWinLossRatio().doubleValue());
        data.setDiversification(report.getDiversification());
        data.setStability(report.getStability());
        return data;
    }
}