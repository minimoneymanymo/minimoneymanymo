package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;

public interface TradeService {
    void createTrade(TradeDto tradeDto, String userId);
}
