package com.beautifulyomin.mmmm.member.service;

import com.beautifulyomin.mmmm.member.dto.ParentRegistrationDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ParentService {
    String registerParent(ParentRegistrationDto parentDto);
    String uploadProfileImage(MultipartFile file) throws IOException;
}
