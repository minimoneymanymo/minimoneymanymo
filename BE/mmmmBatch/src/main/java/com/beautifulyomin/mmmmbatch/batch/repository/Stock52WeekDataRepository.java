package com.beautifulyomin.mmmmbatch.batch.repository;

import com.beautifulyomin.mmmmbatch.batch.entity.Stock52weekData;
import com.beautifulyomin.mmmmbatch.batch.entity.key.DailyStockDataId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Stock52WeekDataRepository extends JpaRepository<Stock52weekData, DailyStockDataId> {
}
