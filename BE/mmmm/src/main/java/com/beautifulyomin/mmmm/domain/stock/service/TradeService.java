package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.stock.dto.ReasonBonusMoneyRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;

import java.time.LocalDate;

public interface TradeService {
    void createTradeByDate(TradeDto tradeDto, Integer childrenId, LocalDate date);
    void createTrade(TradeDto tradeDto, String userId);
    int updateReaseonBonusMoney(String userId,ReasonBonusMoneyRequestDto requestDto);
}
