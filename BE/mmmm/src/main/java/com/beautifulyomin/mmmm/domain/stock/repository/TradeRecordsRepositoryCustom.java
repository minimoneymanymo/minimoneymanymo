package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import org.springframework.stereotype.Repository;

import java.util.Optional;


public interface TradeRecordsRepositoryCustom {
    TradeDto findTradeByStockCode(String stockCode);

    Optional<TradeDto> findTredeByCreateAt(String createAt);

    long UpdateReasonBonusMoneyByCreateAt(String parentUserId, Integer childrenId, Integer reasonBonusMoney, String createAt);

}