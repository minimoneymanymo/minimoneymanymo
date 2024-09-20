package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.stock.dto.response.StockDetailResponseDto;

public interface StockService {

    StockDetailResponseDto getStockDetailResponse(String stockCode);
}
