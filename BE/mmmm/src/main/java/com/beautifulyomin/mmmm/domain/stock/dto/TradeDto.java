package com.beautifulyomin.mmmm.domain.stock.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TradeDto { // trade put 들어오면 사용하는 dto
//    @NotNull
    private Integer childrenId;           // 자녀 id -> 토큰에서 뽑음

    private BigDecimal stockCode;         // 종목코드
    private Integer amount;                // 거래 금액 -> 칸에 입력하는 금액
    private BigDecimal tradeSharesCount;   // 거래 주식 수
    private String reason;                 // 거래 사유
    private String tradeType;              // 거래 유형 (매수, 매도 등) - 매수 4 , 매도 5

//    private String createdAt;              // 체결시간 -> 자동ㅇㅇㅇㅇ으


//    private BigDecimal stockTradingGain;   // 손익 머니 -> 거래에서는 필요하지 않음.
//    private Integer reasonBonusMoney;      // 이유머니 -> 매수/매도 모두 필요, 하지만 거래에서는 필요하지 않음.
}
