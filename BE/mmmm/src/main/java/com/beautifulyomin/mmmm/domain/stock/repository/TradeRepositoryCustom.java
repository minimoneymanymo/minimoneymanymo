package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;

public interface TradeRepositoryCustom {
    TradeDto findTradeByStockCode(String stockCode);
}
