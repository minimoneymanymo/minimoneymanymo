package com.beautifulyomin.mmmm.domain.fund.service;

import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyDto;
import com.beautifulyomin.mmmm.domain.fund.dto.WithdrawRequestDto;

import java.util.List;

public interface FundService {
    List<MoneyChangeDto> findAllMoneyRecordsById(String childrenId);
    MoneyDto findMoneyById(String childrenId);
    void requestWithdraw(String childrenId, Integer amount);
    List<WithdrawRequestDto> findAllWithdrawRequest(String childrenId);
}
