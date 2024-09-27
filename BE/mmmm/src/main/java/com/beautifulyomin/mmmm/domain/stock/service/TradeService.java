package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.stock.dto.ReasonBonusMoneyRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;

public interface TradeService {
    void createTrade(TradeDto tradeDto, String userId);
    int updateReaseonBonusMoney(String userId,ReasonBonusMoneyRequestDto requestDto);
}
