package com.beautifulyomin.mmmmbatch.batch.analysis.repository;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.RowReportValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RowReportValueRepository extends JpaRepository<RowReportValue, Long> {
}
