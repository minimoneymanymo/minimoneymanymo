package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;

public interface TradeService {
    void createTrade(TradeDto tradeDto);
}
