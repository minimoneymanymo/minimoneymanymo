package com.beautifulyomin.mmmm.domain.stock.dto.request;

import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;
import java.math.BigInteger;

@ToString
@Data
public class StockFilterRequestDto {
    //시장
    private String marketType; // 시장(코스피, 코스닥)

    //시가총액
    private String marketCapSize; // 시가총액 크기 (소, 중, 대)

    //기업 가치
    private BigDecimal perMin; // PER 최소값
    private BigDecimal perMax; // PER 최대값
    private BigDecimal pbrMin; // PBR 최소값
    private BigDecimal pbrMax;
    private BigDecimal epsMin; // EPS 최소값
    private BigDecimal epsMax;
    private BigDecimal bpsMin; // BPS 최소값
    private BigDecimal bpsMax;

    //가격 조건
    private BigDecimal priceMin; // 주가 최소값
    private BigDecimal priceMax;
    private BigDecimal changeRateMin; // 주가 등락률 최소값
    private BigDecimal changeRateMax;
    private BigDecimal high52WeekMin; // 52주 최고가 최소값
    private BigDecimal high52WeekMax;
    private BigDecimal low52WeekMin; // 52주 최저가 최소값
    private BigDecimal low52WeekMax;

    //거래량/거래대금
    private BigInteger volumeMin; // 1일 누적 거래량 최소값
    private BigInteger volumeMax;
    private BigInteger tradingValueMin; // 1일 누적 거래 대금 최소값
    private BigInteger tradingValueMax;
    private BigDecimal volumeTurnoverRatioMin; // 거래량 회전률 최소값
    private BigDecimal volumeTurnoverRatioMax;

}