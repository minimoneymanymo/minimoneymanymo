package com.beautifulyomin.mmmmbatch.batch.analysis.repository;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.MonthlyInvestorStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MonthlyInvestorRepository extends JpaRepository<MonthlyInvestorStatistics, Long> {
}
