package com.beautifulyomin.mmmmbatch.batch.stock.repository;

import com.beautifulyomin.mmmmbatch.batch.stock.entity.DailyStockChart;
import com.beautifulyomin.mmmmbatch.batch.stock.entity.key.DailyStockDataId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyStockChartRepository extends JpaRepository<DailyStockChart, DailyStockDataId> {
}
