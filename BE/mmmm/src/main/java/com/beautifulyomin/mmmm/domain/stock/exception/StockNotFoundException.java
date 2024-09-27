package com.beautifulyomin.mmmm.domain.stock.exception;

public class StockNotFoundException extends RuntimeException {
    public StockNotFoundException(String stockCode,String cause) {
        super(String.format("%s에서 %s 번의 종목이 존재하지 않습니다.",cause,stockCode));
    }
}
