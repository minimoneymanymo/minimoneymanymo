package com.beautifulyomin.mmmmbatch.batch.repository;

import com.beautifulyomin.mmmmbatch.batch.entity.DailyStockData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockDataRepository extends JpaRepository<DailyStockData, Long> {
}
