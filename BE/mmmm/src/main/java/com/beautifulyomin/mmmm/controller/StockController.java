package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.domain.stock.dto.request.StockFilterRequestDto;
import com.beautifulyomin.mmmm.domain.stock.service.StockService;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;


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
    public ResponseEntity<CommonResponseDto> getStockDetail(
            @PathVariable(name = "stockCode") @NotNull @Pattern(regexp = "\\d{6}") String stockCode) {
        return ResponseEntity.ok(CommonResponseDto.builder()
                .stateCode(200)
                .message("주식 상세 조회 성공!")
                .data(stockService.getStockDetailResponse(stockCode))
                .build());
    }

    @GetMapping()
    public ResponseEntity<CommonResponseDto> getStockList(@ModelAttribute StockFilterRequestDto filterRequestDto, Pageable pageable) {
        log.info(filterRequestDto.toString());
        return ResponseEntity.ok(CommonResponseDto.builder()
                .stateCode(200)
                .message("주식 리스트 조회 성공!")
                .data(stockService.getFilteredStocks(filterRequestDto, pageable))
                .build());
    }
}
