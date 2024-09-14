package com.beautifulyomin.mmmmbatch.batch.repository;

import com.beautifulyomin.mmmmbatch.batch.entity.DailyStockChart;
import com.beautifulyomin.mmmmbatch.batch.entity.key.DailyStockDataId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyStockChartRepository extends JpaRepository<DailyStockChart, DailyStockDataId> {
}
