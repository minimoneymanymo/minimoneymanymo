package com.beautifulyomin.mmmm.domain.member.service;

import com.beautifulyomin.mmmm.domain.member.dto.ChildInfoDto;
import com.beautifulyomin.mmmm.domain.member.dto.JoinRequestDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ChildrenService {
    String registerChildren(JoinRequestDto joinDto);
    String uploadProfileImage(MultipartFile file) throws IOException;
    boolean isExistByUserId(String userId);
    ChildInfoDto childInfoByUserId(String userId);
}
