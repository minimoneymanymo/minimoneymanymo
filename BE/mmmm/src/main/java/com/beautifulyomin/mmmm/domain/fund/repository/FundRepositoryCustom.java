package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyDto;

import java.util.List;

public interface FundRepositoryCustom {
    // 머니변동내역 조회
    List<MoneyChangeDto> findAllMoneyRecordsById(String childrenId);

    // 보유자금(머니, 출가금 잔액, 평가금) 조회
    MoneyDto findMoneyById(String childrenId);
}
