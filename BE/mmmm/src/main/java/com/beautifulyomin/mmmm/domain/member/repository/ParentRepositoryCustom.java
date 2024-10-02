package com.beautifulyomin.mmmm.domain.member.repository;

import com.beautifulyomin.mmmm.domain.member.dto.MyChildDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenWaitingDto;
import com.beautifulyomin.mmmm.domain.member.dto.ParentWithBalanceDto;

import java.util.List;

public interface ParentRepositoryCustom {
    List<Integer> findAllMyChildrenIdByParentUserId(String parentUserId);
    MyChildrenDto findAllMyChildrenByChildId(Integer childrenId);
    List<MyChildrenWaitingDto> findNotApprovedMyChildrenByParentUserId(String parentUserId);
    long updateIsApprovedById(Integer parentId, Integer childrenId);
    long updateSettingMoneyById(Integer childrenId, Integer settingMoney);
    MyChildDto findAllMyChildByChildrenId(Integer childrenId);
    long updateSettingWithdrawableMoneyById(Integer childrenId, Integer settingWithdrawableMoney);
    long updateSettingQuizBonusMoneyById(Integer childrenId, Integer settingQuizBonusMoney);

    // 부모 잔액 업데이트(충전, 환불)
    long updateBalance(String parentUserId, Integer amount);

    // 계좌 연결
    long updateParentAccount(String parentUserId, String accountNumber, String bankCode);
    long updateChildAccount(String childUserId, String accountNumber, String bankCode);
    List<ParentWithBalanceDto> getParentIdAndBalanceList();
}
