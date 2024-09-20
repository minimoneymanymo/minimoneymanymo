package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.entity.DailyStockChart;
import com.beautifulyomin.mmmm.domain.stock.entity.key.DailyStockDataId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyStockChartRepository extends JpaRepository<DailyStockChart, DailyStockDataId> , DailyStockChartRepositoryCustom{
}
