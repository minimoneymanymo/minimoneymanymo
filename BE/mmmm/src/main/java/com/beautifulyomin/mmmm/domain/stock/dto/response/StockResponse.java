package com.beautifulyomin.mmmm.domain.stock.dto.response;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;

public interface StockResponse {
    String getCompanyName();

    String getStockCode();

    LocalDate getClosingDate(); //종가 날짜

    BigDecimal getClosingPrice(); //종가

    String getPriceChangeSign(); //전일대비 부호

    BigDecimal getPriceChange(); //전일 대비 금액

    BigDecimal getPriceChangeRate(); //전일 대비율

    BigInteger getMarketCapitalization(); //시가총액

    Long getTradingVolume(); //누적 거래량
}
