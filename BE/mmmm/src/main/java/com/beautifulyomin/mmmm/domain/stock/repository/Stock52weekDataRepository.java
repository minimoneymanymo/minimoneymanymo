package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.entity.Stock52weekData;
import com.beautifulyomin.mmmm.domain.stock.entity.key.DailyStockDataId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Stock52weekDataRepository extends JpaRepository<Stock52weekData, DailyStockDataId> {
}
