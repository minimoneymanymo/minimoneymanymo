package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.stock.dto.request.StockFilterRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockDetailResponseDto;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockFilterResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StockService {

    StockDetailResponseDto getStockDetailResponse(String stockCode);

    Page<StockFilterResponseDto> getFilteredStocks(StockFilterRequestDto filterRequestDto, Pageable pageable);
}
