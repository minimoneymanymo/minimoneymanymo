package com.beautifulyomin.mmmmbatch.batch.analysis.repository;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReport;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReportV2;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.key.InvestmentReportId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvestmentAnalysisRepositoryV2  extends JpaRepository<InvestmentReportV2, InvestmentReportId> {
}
