package com.beautifulyomin.mmmm.domain.analysis.service;

import com.beautifulyomin.mmmm.domain.analysis.dto.response.InvestmentReportDto;

import java.time.LocalDate;


public interface AnalysisRepositoryCustom {
    LocalDate findLatestDate();

    InvestmentReportDto overallStatisticsByDate(LocalDate latestDate);
}
