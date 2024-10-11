package com.beautifulyomin.mmmm.domain.stock.exception;

public class TradeNotFoundException  extends RuntimeException {
    public TradeNotFoundException(String createAt) {
        super(String.format("%s 의 거래내역이 존재하지않습니다.",createAt));
    }
}
