package com.beautifulyomin.mmmm.domain.stock.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TradeDto { // trade put 들어오면 사용하는 dto
//    @NotNull
    private Integer tradeRecordId;        // (꼭 필요하지 않을 수도 있음) 거래 내역 id

    private BigDecimal stockCode;         // 종목코드
    private Integer childrenId;           // 자녀 id
    private Integer amount;                // 거래 금액 -> 칸에 입력하는 금액
    private String createdAt;              // 체결시간
    private String tradeType;              // 거래 유형 (매수, 매도 등) - 매수 4 , 매도 5
    private String reason;                 // 거래 사유

    private BigDecimal tradeSharesCount;   // 거래 주식 수
    private BigDecimal stockTradingGain;   // 손익 머니

    private Integer reasonBonusMoney;      // 이유머니 - 매수/매도 모두 필요
}
