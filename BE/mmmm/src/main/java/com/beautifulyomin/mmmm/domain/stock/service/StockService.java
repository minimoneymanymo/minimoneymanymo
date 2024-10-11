package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.stock.dto.request.StockFilterRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockDetailResponseDto;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StockService {

    StockDetailResponseDto getStockDetailResponse(String stockCode, String userId);

    Page<StockResponse> getFilteredStocks(StockFilterRequestDto filterRequestDto, String userId, Pageable pageable);

    boolean toggleFavoriteStock(String userId, String stockCode);
}
