package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;

import java.util.List;

public interface FundRepositoryCustom {
    List<MoneyChangeDto> findAllMoneyRecordsById(String childrenId);
}
