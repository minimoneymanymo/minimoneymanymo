package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.dto.*;
import com.beautifulyomin.mmmm.domain.member.dto.ParentWithBalanceDto;
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
    long approveWithdrawalRequest(String parentId, Integer childrenId, Integer amount, String createdAt);

    // 전체 거래내역 조회
    List<TradeDto> findAllTradeRecord(Integer childrenId, Integer year, Integer month);

    // 보유 주식 조회
    List<StockHeldDto> findAllStockHeld(Integer childrenId);

    //용돈 미지급 내역 조회
    List<AllowancePaymentDto> findAllUnpaid(String parentUserId);

    //매달 용돈 지급
    long updateAllowanceMonthly(ParentWithBalanceDto parent);

    //용돈 한번 지급
    long updateAllowance( Integer amount,Integer parentId, Integer childrenId);


}
