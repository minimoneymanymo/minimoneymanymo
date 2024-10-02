package com.beautifulyomin.mmmmbatch.batch.analysis.repository;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestorCluster;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.key.InvestmentReportId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvestorClusterRepository extends JpaRepository<InvestorCluster, InvestmentReportId> {
}
