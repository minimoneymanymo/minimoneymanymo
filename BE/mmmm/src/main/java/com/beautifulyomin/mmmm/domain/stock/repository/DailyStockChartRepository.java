package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.entity.DailyStockChart;
import com.beautifulyomin.mmmm.domain.stock.entity.key.DailyStockDataId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyStockChartRepository extends JpaRepository<DailyStockChart, DailyStockDataId>{
    List<DailyStockChart> findByStockCodeAndDateBetweenOrderByDateAsc(String stockCode, LocalDate startDate, LocalDate endDate);
}
