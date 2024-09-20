package com.beautifulyomin.mmmm.domain.fund.service;

import com.beautifulyomin.mmmm.domain.fund.dto.StockHeldDto;

import java.util.List;

public interface StockHeldService {
    List<StockHeldDto> findAllStocksHeldById(String childrenId);
    StockHeldDto findStockHeldById(String childrenId);
}
