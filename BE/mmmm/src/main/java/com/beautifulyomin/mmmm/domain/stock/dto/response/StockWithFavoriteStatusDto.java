package com.beautifulyomin.mmmm.domain.stock.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class StockWithFavoriteStatusDto implements StockResponse {
    private String companyName;
    private String stockCode;
    private LocalDate closingDate; //종가 날짜
    private BigDecimal closingPrice; //종가
    private String priceChangeSign; //전일대비 부호
    private BigDecimal priceChange; //전일 대비 금액
    private BigDecimal priceChangeRate; //전일 대비율
    private BigInteger marketCapitalization; //시가총액
    private Long tradingVolume; //누적 거래량
    private boolean isFavorite; //관심종목 여부
}