package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;

import java.util.Optional;


public interface TradeRecordsRepositoryCustom {
    TradeDto findTradeByStockCode(String stockCode);

    Optional<TradeDto> findTradeByCreateAt(String createAt,  String childrenUserId);

    long updateReasonBonusMoneyByCreateAt(String parentUserId, Integer childrenId, Integer reasonBonusMoney, String createAt);

}