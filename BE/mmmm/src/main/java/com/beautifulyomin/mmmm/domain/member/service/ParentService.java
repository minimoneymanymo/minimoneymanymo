package com.beautifulyomin.mmmm.domain.member.service;

import com.beautifulyomin.mmmm.domain.member.dto.JoinRequestDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ParentService {
    String registerParent(JoinRequestDto joinDto);
    String uploadProfileImage(MultipartFile file) throws IOException;
    boolean isExistByUserId(String userId);
    boolean isExistByPhoneNumber(String phoneNumber);
}
