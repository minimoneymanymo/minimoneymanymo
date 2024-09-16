package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.domain.stock.service.StockService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@Validated
@RequestMapping("/stocks")
public class StockController {
    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/{stockCode}")
    public ResponseEntity<CommonResponseDto> getStockDetail(@PathVariable String stockCode) { //TODO: 유효성
        return ResponseEntity.ok(CommonResponseDto.builder()
                .stateCode(200)
                .message("주식 상세 조회 성공!")
                .data(stockService.getStockDetailResponse(stockCode.toString()))
                .build());
    }
}
