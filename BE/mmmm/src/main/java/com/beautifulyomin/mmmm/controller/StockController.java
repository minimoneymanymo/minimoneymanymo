package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
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
    private final JWTUtil jwtUtil;

    public StockController(StockService stockService, JWTUtil jwtUtil) {
        this.stockService = stockService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/{stockCode}")
    public ResponseEntity<CommonResponseDto> getStockDetail(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable(name = "stockCode") @NotNull @Pattern(regexp = "\\d{6}") String stockCode) {
        String userId =  (token != null && !token.isEmpty()) ? jwtUtil.getUsername(token) : null;
        return ResponseEntity.ok(CommonResponseDto.builder()
                .stateCode(200)
                .message("주식 상세 조회 성공!")
                .data(stockService.getStockDetailResponse(stockCode, userId))
                .build());
    }

    @GetMapping()
    public ResponseEntity<CommonResponseDto> getStockList(
            @RequestHeader(value = "Authorization", required = false) String token,
            @ModelAttribute StockFilterRequestDto filterRequestDto, Pageable pageable) {
        String userId =  (token != null && !token.isEmpty()) ? jwtUtil.getUsername(token) : null;
        log.info(filterRequestDto.toString());
        return ResponseEntity.ok(CommonResponseDto.builder()
                .stateCode(200)
                .message("주식 리스트 조회 성공!")
                .data(stockService.getFilteredStocks(filterRequestDto, userId, pageable))
                .build());
    }

    @PostMapping("/favorite/{stockCode}/toggle")
    public ResponseEntity<CommonResponseDto> toggleFavoriteStock(
            @RequestHeader("Authorization") String token,
            @PathVariable(name = "stockCode") @NotNull @Pattern(regexp = "\\d{6}") String stockCode) {
        String userId = jwtUtil.getUsername(token);
        return ResponseEntity.ok(CommonResponseDto.builder()
                .stateCode(201)
                .message("관심 종목 토글 성공")
                .data(stockService.toggleFavoriteStock(userId, stockCode))
                .build());
    }
}
