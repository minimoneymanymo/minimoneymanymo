package com.beautifulyomin.mmmm.domain.stock.dto.request;

import lombok.Data;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;

@ToString
@Data
public class StockFilterRequestDto {
    // Elasticsearch를 이용한 자동완성 검색기능용
    private String search; // 맨 처음에는 string 하나로 다 들어옴
    private List<String> searchList;

    // search 문자열을 List<String>으로 변환하는 메서드
    private List<String> parseSearchToList(String search) {
        if (search != null && !search.isEmpty()) {
            return Arrays.asList(search.split(","));
        }
        return null;
    }

    public void setSearch(String search) {
        this.search = search;
        // search가 변경될 때 searchList도 업데이트
        this.searchList = parseSearchToList(search);
    }

    @Override
    public String toString() {
        return "StockFilterRequestDto{"+"searchList="+searchList+"}";
    }

    //시장
    private String marketType; // 시장(코스피, 코스닥)

    //시가총액
    private String marketCapSize; // 시가총액 크기 (소, 중, 대)

    //기업 가치
    private BigDecimal perMin; // PER 최소값
    private BigDecimal perMax; // PER 최대값
    private BigDecimal pbrMin; // PBR 최소값
    private BigDecimal pbrMax;

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

}