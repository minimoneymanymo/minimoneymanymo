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

    // 거래 내역에 사용되는 생성자
    public MoneyChangeDto(Integer amount, String tradeType, String createdAt, String companyName, BigDecimal tradeSharesCount) {
        this.amount = amount;
        this.tradeType = tradeType;
        this.createdAt = createdAt;
        this.companyName = companyName;
        this.tradeSharesCount = tradeSharesCount;
        this.remainAmount = null;
    }

    // 입출금 내역에 사용되는 생성자
    public MoneyChangeDto(Integer amount, String tradeType, String createdAt, Integer remainAmount) {
        this.amount = amount;
        this.tradeType = tradeType;
        this.createdAt = createdAt;
        this.remainAmount = remainAmount;
        this.companyName = null;
        this.tradeSharesCount = null;
    }

}
