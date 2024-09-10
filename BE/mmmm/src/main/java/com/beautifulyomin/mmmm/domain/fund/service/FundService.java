package com.beautifulyomin.mmmm.domain.fund.service;

import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;

import java.util.List;

public interface FundService {
    List<MoneyChangeDto> findAllMoneyRecordsById(String childrenId);

}
