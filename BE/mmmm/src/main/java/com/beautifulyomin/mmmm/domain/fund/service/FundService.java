package com.beautifulyomin.mmmm.domain.fund.service;

import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyDto;
import com.beautifulyomin.mmmm.domain.fund.dto.StockHeldDto;
import com.beautifulyomin.mmmm.domain.fund.dto.WithdrawRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;

import java.util.List;

public interface FundService {
    // 머니 사용 내역 조회
    List<MoneyChangeDto> findAllMoneyRecordsById(String childrenId);

    // 보유 자금 조회
    MoneyDto findMoneyById(String childrenId);

    // 출금 요청
    void requestWithdraw(String childrenId, Integer amount);

    // 출금 요청 내역 조회
    List<WithdrawRequestDto> findAllWithdrawRequest(String childrenId);

    // 부모-출금 요청 승인
    long approveWithdrawalRequest(String parentId, String childrenId, Integer amount, String createdAt);

    // 거래내역 조회
    List<TradeDto> findAllTradeRecord(String childrenId, Integer year, Integer month);

    // 보유 주식 조회
    List<StockHeldDto> findAllStockHeld(String childrenId);
}