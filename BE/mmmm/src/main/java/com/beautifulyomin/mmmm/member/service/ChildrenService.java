package com.beautifulyomin.mmmm.member.service;

import com.beautifulyomin.mmmm.member.dto.JoinRequestDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ChildrenService {
    String registerChildren(JoinRequestDto joinDto);
    String uploadProfileImage(MultipartFile file) throws IOException;
}
