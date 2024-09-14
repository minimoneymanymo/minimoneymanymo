package com.beautifulyomin.mmmmbatch.batch.stock.repository;

import com.beautifulyomin.mmmmbatch.batch.stock.entity.Stock52weekData;
import com.beautifulyomin.mmmmbatch.batch.stock.entity.key.DailyStockDataId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Stock52WeekDataRepository extends JpaRepository<Stock52weekData, DailyStockDataId> {
}
