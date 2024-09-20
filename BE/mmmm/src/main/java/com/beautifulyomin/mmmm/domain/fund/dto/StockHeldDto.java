package com.beautifulyomin.mmmm.domain.fund.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class StockHeldDto {
    @NotNull
    private Integer childrenId;
    @NotNull
    private String stockCode;         // 종목코드
    @NotNull
    private BigDecimal remainSharesCount;
    @NotNull
    private Integer totalAmount;
}
