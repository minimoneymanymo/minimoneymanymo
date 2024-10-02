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
    private double tradingFrequency;
    private double cashRatio;
    private double winLossRatio;
    private double diversification;
    private double stability;
}
