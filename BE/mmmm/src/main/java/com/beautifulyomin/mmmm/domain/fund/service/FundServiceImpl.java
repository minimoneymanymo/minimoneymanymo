package com.beautifulyomin.mmmm.domain.fund.service;


import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.repository.FundRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FundServiceImpl implements FundService {

    private final FundRepository fundRepository;

    @Override
    public List<MoneyChangeDto> findAllMoneyRecordsById(String childrenId) {
        return fundRepository.findAllMoneyRecordsById(childrenId);
    }
}
