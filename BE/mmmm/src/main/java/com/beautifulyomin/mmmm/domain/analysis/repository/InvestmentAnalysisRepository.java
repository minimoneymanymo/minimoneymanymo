package com.beautifulyomin.mmmm.domain.analysis.repository;

import com.beautifulyomin.mmmm.domain.analysis.entity.InvestmentReport;
import com.beautifulyomin.mmmm.domain.analysis.entity.key.InvestmentReportId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface InvestmentAnalysisRepository extends JpaRepository<InvestmentReport, InvestmentReportId> {
    InvestmentReport findByChildrenIdAndDate(Integer childrenId, LocalDate date);
}
