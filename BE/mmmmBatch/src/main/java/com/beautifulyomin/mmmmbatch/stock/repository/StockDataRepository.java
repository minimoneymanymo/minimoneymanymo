package com.beautifulyomin.mmmmbatch.stock.repository;

import com.beautifulyomin.mmmmbatch.stock.entity.DailyStockData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockDataRepository extends JpaRepository<DailyStockData, Long> {
}
