package com.beautifulyomin.mmmm.domain.member.service;

import com.beautifulyomin.mmmm.domain.member.dto.JoinRequestDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenWaitingDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ParentService {
    String registerParent(JoinRequestDto joinDto);
    String uploadProfileImage(MultipartFile file) throws IOException;
    boolean isExistByUserId(String userId);
    boolean isExistByPhoneNumber(String phoneNumber);
    List<MyChildrenDto> getMyChildren(String userId);
    MyChildDto getMyChild(String parentUserId, Integer ChildrenId);
    List<MyChildrenWaitingDto> getMyChildWaiting(String userId);
    int addMyChildren(String parentUserId, Integer childrenId);
    int setMyChildAllowance(String parentUserId, Integer childrenId, Integer settingMoney);

    int setMyChildQuizBonusMoney(String userId, Integer childrenId, Integer settingQuizBonusMoney);

    int setMyChildWithdrawableMoney(String userId, Integer childrenId, Integer settingWithdrawableMoney);
}
