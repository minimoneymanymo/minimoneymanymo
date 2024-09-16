package com.beautifulyomin.mmmm.domain.fund.service;


import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyDto;
import com.beautifulyomin.mmmm.domain.fund.entity.TransactionRecord;
import com.beautifulyomin.mmmm.domain.fund.repository.FundRepositoryCustom;
import com.beautifulyomin.mmmm.domain.fund.repository.FundRepository;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FundServiceImpl implements FundService {
    
    private final ChildrenRepository childrenRepository;
    private final FundRepository fundRepository;
    private final FundRepositoryCustom fundRepositoryCustom;

    @Override
    public List<MoneyChangeDto> findAllMoneyRecordsById(String childrenId) {
        return fundRepositoryCustom.findAllMoneyRecordsById(childrenId);
    }

    @Override
    public MoneyDto findMoneyById(String childrenId) {
        return fundRepositoryCustom.findMoneyById(childrenId);
    }

    @Override
    public TransactionRecord requestWithdraw(String childrenId, Integer amount) {
        Children child = childrenRepository.findByUserId(childrenId)
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + childrenId));
        TransactionRecord request = new TransactionRecord();
        request.setChildren(child);
        request.setAmount(amount);
        request.setTradeType("1");
        request.setRemainAmount(child.getMoney());
        System.out.println(request);
        return fundRepository.save(request);
    }
}
