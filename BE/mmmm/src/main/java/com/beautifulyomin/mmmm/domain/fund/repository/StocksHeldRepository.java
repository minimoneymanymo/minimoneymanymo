package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.entity.StocksHeld;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StocksHeldRepository extends JpaRepository<StocksHeld, Integer> {
    Optional<StocksHeld> findByChildren_ChildrenIdAndStock_StockCode(Integer childrenId, String stockCode);
}
