package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyDto;
import com.beautifulyomin.mmmm.domain.fund.dto.WithdrawRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;

import java.util.List;

public interface FundRepositoryCustom {
    // 머니변동내역 조회
    List<MoneyChangeDto> findAllMoneyRecordsById(String childrenId);

    // 보유자금(머니, 출가금 잔액, 평가금) 조회
    MoneyDto findMoneyById(String childrenId);

    // 출금 요청 내역 조회
    List<WithdrawRequestDto> findAllWithdrawalRequest(Integer childrenId);

    // 출금 요청 승인
    long approveWithdrawalRequest(Integer childrenId, Integer amount, String createdAt);

    // 전체 거래내역 조회
    List<TradeDto> findAllTradeRecord(Integer childrenId, Integer year, Integer month);
}
