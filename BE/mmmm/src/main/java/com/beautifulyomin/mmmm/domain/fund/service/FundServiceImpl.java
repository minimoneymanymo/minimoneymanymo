package com.beautifulyomin.mmmm.domain.fund.service;


import com.beautifulyomin.mmmm.domain.fund.dto.*;
import com.beautifulyomin.mmmm.domain.fund.entity.TransactionRecord;
import com.beautifulyomin.mmmm.domain.fund.repository.FundRepositoryCustom;
import com.beautifulyomin.mmmm.domain.fund.repository.TransactionRepository;
import com.beautifulyomin.mmmm.domain.member.dto.ParentWithBalanceDto;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.member.entity.ParentAndChildren;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentAndChildrenRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentRepositoryCustom;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.exception.InvalidRequestException;
import com.beautifulyomin.mmmm.exception.InvalidRoleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FundServiceImpl implements FundService {
    
    private final ChildrenRepository childrenRepository;
    private final TransactionRepository transactionRepository;
    private final FundRepositoryCustom fundRepositoryCustom;
    private final ParentRepository parentRepository;
    private final ParentRepositoryCustom parentRepositoryCustom;
    private final ParentAndChildrenRepository parentAndChildrenRepository;

    @Override
    public List<MoneyChangeDto> findAllMoneyRecordsById(String childrenId) {
        return fundRepositoryCustom.findAllMoneyRecordsById(childrenId);
    }

    @Override
    public MoneyDto findMoneyById(String childrenId) {
        return fundRepositoryCustom.findMoneyById(childrenId);
    }

    @Override
    public void requestWithdraw(String childrenId, Integer amount) {
        Children child = childrenRepository.findByUserId(childrenId)
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + childrenId));
        // 출금요청 시 머니, 출가금 잔액 감소
        child.setMoney(child.getMoney()-amount);
        child.setWithdrawableMoney(child.getWithdrawableMoney() - amount);

        TransactionRecord request = new TransactionRecord();
        request.setChildren(child);
        request.setAmount(amount);
        request.setTradeType("1");
        request.setRemainAmount(child.getMoney());

        childrenRepository.save(child); // 업데이트
        transactionRepository.save(request);
    }

    @Override
    public List<WithdrawRequestDto> findAllWithdrawRequest(String childrenId) {
        Children child = childrenRepository.findByUserId(childrenId)
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + childrenId));
        return fundRepositoryCustom.findAllWithdrawalRequest(child.getChildrenId());
    }

    @Override
    public long approveWithdrawalRequest(String parentId, String childrenId, Integer amount, String createdAt) {
        Children child = childrenRepository.findByUserId(childrenId)
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + childrenId));
        return fundRepositoryCustom.approveWithdrawalRequest(parentId, child.getChildrenId(), amount, createdAt);
    }

    @Override
    public List<TradeDto> findAllTradeRecord(String childrenId, Integer year, Integer month) {
        Children children = childrenRepository.findByUserId(childrenId)
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + childrenId));
        return fundRepositoryCustom.findAllTradeRecord(children.getChildrenId(), year, month);
    }

    @Override
    public List<StockHeldDto> findAllStockHeld(String childrenId) {
        Children children = childrenRepository.findByUserId(childrenId)
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + childrenId));
        return fundRepositoryCustom.findAllStockHeld(children.getChildrenId());
    }

    @Override
    public List<AllowancePaymentDto> findAllUnpaid(String userId) {
        return fundRepositoryCustom.findAllUnpaid(userId);
    }

    @Override
    public long updateAllowance(String parentUserId, AllowancePaymentDto request) {
        //없는관계인 경우
        Parent parent = parentRepository.findByUserId(parentUserId)
                .orElseThrow(() -> new InvalidRoleException("부모가 아닙니다."));
        Children child = childrenRepository.findChildrenByChildrenId(request.getChildrenId())
                .orElseThrow(() -> new InvalidRoleException("이 유저아이디의 자녀 찾을 수 없음 : " + request.getChildrenId()));

        Integer parentId = parent.getParentId();
        Integer childrenId = child.getChildrenId();
        Optional<ParentAndChildren> parentAndChildrenTrue = parentAndChildrenRepository.findByParent_ParentIdAndChild_ChildrenIdAndIsApprovedTrue(parentId, childrenId);

        // 없는 관계인 경우 에러
        if(parentAndChildrenTrue.isEmpty()){
            throw new InvalidRoleException("부모자식관계가 아닙니다.");
        }

        //부모의 계좌 잔액이 부족
        if(parent.getBalance() < request.getAmount()){
            throw new InvalidRequestException("용돈 금액이 마니모 계좌 잔액보다 큽니다.");
        }

        //있는 경우
        Optional<TransactionRecord> existingtrade = transactionRepository.findByTransactionId(request.getTransactionId());
        if (existingtrade.isPresent()) {
            transactionRepository.delete(existingtrade.get());
        }

        return fundRepositoryCustom.updateAllowance(request.getAmount(),parentId,childrenId);
    }

    @Override
    public long updateAllowanceMonthly() {
        List<ParentWithBalanceDto> parentList = parentRepositoryCustom.getParentIdAndBalanceList();
        for(ParentWithBalanceDto parent : parentList){
            long result = fundRepositoryCustom.updateAllowanceMonthly(parent);
        }
        return 0;
    }
}
