package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import org.springframework.stereotype.Repository;

@Repository
public interface TradeRecordsRepositoryCustom {
    TradeDto findTradeByStockCode(String stockCode);
}
