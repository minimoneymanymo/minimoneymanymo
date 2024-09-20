package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.entity.StocksHeld;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StocksHeldRepository extends JpaRepository<StocksHeld, Integer> {
    Optional<StocksHeld> findByChildren_ChildrenIdAndStock_StockCode(Integer childrenId, String stockCode);
}
