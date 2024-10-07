package com.beautifulyomin.mmmm.domain.fund.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockHeldDto {
    @NotNull
    private Integer childrenId;
    @NotNull
    private String stockCode;         // 종목코드
    @NotNull
    private BigDecimal remainSharesCount; // 보유주수
    @NotNull
    private Integer totalAmount; // 매입머니 = 매수금의 총합(가격 총합)

    private String companyName;
    private String marketName;
    private BigDecimal closingPrice; // 현재가(주식 종가) = numeric(10, 2)
    private BigDecimal averagePrice; // 평균단가 = 매입머니(가격 총합)/ 보유 주수
    private BigDecimal evaluateMoney; // 평가머니 = 보유주수 * 현재가
    private BigDecimal priceChangeRate; // 등락률 = (현재가(주식 종가)-평균단가)/평균단가 * 100 (소수점 셋째 자리에서 반올림)
    private BigDecimal priceChangeMoney; // 등락머니 = 평가머니 - 매입머니

    private String priceChangeSign;
    private BigDecimal priceChange;
    private BigDecimal stockPriceChangeRate;

    public StockHeldDto(Integer childrenId, String stockCode, BigDecimal remainSharesCount, Integer totalAmount){
        this.childrenId = childrenId;
        this.stockCode = stockCode;
        this.remainSharesCount = remainSharesCount;
        this.totalAmount = totalAmount;
    }

    public StockHeldDto(String companyName, String marketName, BigDecimal closingPrice, String priceChangeSign, BigDecimal priceChange, BigDecimal stockPriceChangeRate) {
        this.companyName = companyName;
        this.marketName = marketName;
        this.closingPrice = closingPrice;
        this.priceChangeSign = priceChangeSign;
        this.priceChange = priceChange;
        this.stockPriceChangeRate = stockPriceChangeRate;
    }
}
