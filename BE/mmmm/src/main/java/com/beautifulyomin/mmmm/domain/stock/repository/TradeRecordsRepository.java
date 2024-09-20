package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TradeRecordsRepository extends JpaRepository<TradeRecord, Integer>, TradeRecordsRepositoryCustom {

}
