package com.beautifulyomin.mmmmbatch.batch.repository;

import com.beautifulyomin.mmmmbatch.batch.entity.DailyStockData;
import com.beautifulyomin.mmmmbatch.batch.entity.key.DailyStockDataId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyStockDataRepository extends JpaRepository<DailyStockData, DailyStockDataId> {
}
