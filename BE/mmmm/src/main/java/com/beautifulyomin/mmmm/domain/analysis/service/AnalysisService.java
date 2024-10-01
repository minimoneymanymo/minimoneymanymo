package com.beautifulyomin.mmmm.domain.analysis.service;

import com.beautifulyomin.mmmm.domain.analysis.dto.response.InvestmentReportDto;

import java.util.Map;

public interface AnalysisService {
    Map<String, InvestmentReportDto> getAnalysisReport(String userId);
}
