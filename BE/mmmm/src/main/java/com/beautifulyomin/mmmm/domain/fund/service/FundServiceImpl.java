package com.beautifulyomin.mmmm.domain.fund.service;


import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyDto;
import com.beautifulyomin.mmmm.domain.fund.entity.TransactionRecord;
import com.beautifulyomin.mmmm.domain.fund.repository.FundRepositoryCustom;
import com.beautifulyomin.mmmm.domain.fund.repository.TransactionRepository;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FundServiceImpl implements FundService {
    
    private final ChildrenRepository childrenRepository;
    private final TransactionRepository transactionRepository;
    private final FundRepositoryCustom fundRepository;

    @Override
    public List<MoneyChangeDto> findAllMoneyRecordsById(String childrenId) {
        return fundRepository.findAllMoneyRecordsById(childrenId);
    }

    @Override
    public MoneyDto findMoneyById(String childrenId) {
        return fundRepository.findMoneyById(childrenId);
    }

    @Override
    public void requestWithdraw(String childrenId, Integer amount) {
        Children child = childrenRepository.findByUserId(childrenId)
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + childrenId));
        TransactionRecord request = new TransactionRecord();
        request.setChildren(child);
        request.setAmount(amount);
        request.setTradeType("1");
        request.setRemainAmount(child.getMoney());
    }
}
