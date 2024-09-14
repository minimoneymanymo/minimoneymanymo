package com.beautifulyomin.mmmmbatch.batch.stock.repository;

import com.beautifulyomin.mmmmbatch.batch.stock.entity.DailyStockData;
import com.beautifulyomin.mmmmbatch.batch.stock.entity.key.DailyStockDataId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyStockDataRepository extends JpaRepository<DailyStockData, DailyStockDataId> {
}
