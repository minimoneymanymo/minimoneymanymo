package com.beautifulyomin.mmmm.domain.stock.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TradeDto { // trade put 들어오면 사용하는 dto
    private Integer childrenId;           // 자녀 id -> 토큰에서 뽑음 -> 컨트롤러에서 처리

    @NotNull
    private String stockCode;         // 종목코드
    @NotNull
    private Integer amount;                // 거래 금액 -> 칸에 입력하는 금액
    @NotNull
    private BigDecimal tradeSharesCount;   // 거래 주식 수
    @NotNull
    private String reason;                 // 거래 사유
    @NotNull
    private String tradeType;              // 거래 유형 (매수, 매도 등) - 매수 4 , 매도 5

    private Integer remainAmount;          // 거래 후 남은 잔액
    private BigDecimal stockTradingGain;   // 손익 머니 -> 매도에서만 사용
    private String createdAt;              // 체결시간 -> 자동으로 생성
    private Integer reasonBonusMoney;      // 이유머니 -> 매수/매도 모두 필요, 하지만 거래에서는 필요하지 않음.
    private String companyName;

    public TradeDto(String stockCode, Integer amount, BigDecimal tradeSharesCount, String reason, String tradeType, Integer remainAmount) {
        this.stockCode = stockCode;
        this.amount = amount;
        this.tradeSharesCount = tradeSharesCount;
        this.reason = reason;
        this.tradeType = tradeType;
        this.remainAmount = remainAmount;
    }

    public TradeDto(String createdAt, String companyName, Integer amount, BigDecimal tradeSharesCount, String reason, Integer reasonBonusMoney, String tradeType, Integer remainAmount) {
        this.createdAt = createdAt;
        this.companyName = companyName;
        this.amount = amount;
        this.tradeSharesCount = tradeSharesCount;
        this.reason = reason;
        this.reasonBonusMoney = reasonBonusMoney;
        this.tradeType = tradeType;
        this.remainAmount = remainAmount;
    }
}
