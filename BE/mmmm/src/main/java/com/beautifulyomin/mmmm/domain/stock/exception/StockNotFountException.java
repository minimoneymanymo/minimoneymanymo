package com.beautifulyomin.mmmm.domain.stock.exception;

public class StockNotFountException extends RuntimeException {
    public StockNotFountException(String stockCode) {
        super(String.format("%s 번의 종목이 존재하지 않습니다.",stockCode));
    }
}
