package com.beautifulyomin.mmmmbatch.batch.stock.repository;

import com.beautifulyomin.mmmmbatch.batch.stock.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepository extends JpaRepository<Stock, String> {
}
