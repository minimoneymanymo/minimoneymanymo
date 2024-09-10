package com.beautifulyomin.mmmm.domain.fund.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

// 머니변동내역
@Data
@AllArgsConstructor
public class MoneyChangeDto {
    @NotNull
    private Integer amount;
    @NotNull
    private String tradeType;
    @NotNull
    private String createdAt;

    // 거래 내역
    private String companyName;
    private BigDecimal tradeSharesCount;

    // 입출금 내역
    private Integer remainAmount;
}
