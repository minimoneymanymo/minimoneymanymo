package com.beautifulyomin.mmmm.domain.fund.service;

import com.beautifulyomin.mmmm.domain.fund.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;

public interface TradeService {
    TradeRecord buyAndSell(TradeDto tradeDto);
}
