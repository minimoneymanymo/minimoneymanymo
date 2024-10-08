package com.beautifulyomin.mmmm.domain.analysis.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentReportDto {
    private String name;
    private double tradingFrequency;
    private double cashRatio;
    private double winLossRatio;
    private double diversification;
    private double stability;
    private String investmentType;

    public InvestmentReportDto(Double cashRatio, Double diversification, Double stability, Double tradingFrequency, Double winLossRatio) {
        this.cashRatio = cashRatio;
        this.diversification = diversification;
        this.stability = stability;
        this.tradingFrequency = tradingFrequency;
        this.winLossRatio = winLossRatio;
    }
}
