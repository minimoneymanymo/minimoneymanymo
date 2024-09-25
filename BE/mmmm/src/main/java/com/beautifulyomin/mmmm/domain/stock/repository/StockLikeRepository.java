package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import com.beautifulyomin.mmmm.domain.stock.entity.StockLikes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StockLikeRepository extends JpaRepository<StockLikes, Integer> {
    Optional<StockLikes> findByChildrenAndStock(Children children, Stock stock);
}
