package com.beautifulyomin.mmmm.domain.member.service;

import com.beautifulyomin.mmmm.domain.member.dto.ChildInfoDto;
import com.beautifulyomin.mmmm.domain.member.dto.JoinRequestDto;
import com.beautifulyomin.mmmm.domain.member.dto.PasswordDto;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ChildrenService {
    String registerChildren(JoinRequestDto joinDto);
    String uploadProfileImage(MultipartFile file, String userId) throws IOException;
    boolean isExistByUserId(String userId);
    ChildInfoDto childInfoByUserId(String userId, String stockCode );
    long updateAccount(String childUserId, String accountNumber, String bankCode);
    Children findByUserId(String childUserId);
    int solveQuiz(Children children);

    String updateChildPassword(PasswordDto passwordDto);
}
