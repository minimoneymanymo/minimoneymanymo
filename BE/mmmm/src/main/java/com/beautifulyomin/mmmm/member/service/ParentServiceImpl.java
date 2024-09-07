package com.beautifulyomin.mmmm.member.service;

import com.beautifulyomin.mmmm.common.dto.ImageDto;
import com.beautifulyomin.mmmm.common.service.FileService;
import com.beautifulyomin.mmmm.member.dto.JoinRequestDto;
import com.beautifulyomin.mmmm.member.dto.ParentRegistrationDto;
import com.beautifulyomin.mmmm.member.entity.Parent;
import com.beautifulyomin.mmmm.member.repository.ParentRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ParentServiceImpl implements ParentService {

    private final ParentRepository parentRepository;
    private final FileService fileService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public ParentServiceImpl(ParentRepository parentRepository, FileService fileService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.parentRepository = parentRepository;
        this.fileService = fileService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public String registerParent(JoinRequestDto joinDto) {
        String encodedPass = bCryptPasswordEncoder.encode(joinDto.getPassword());

        Parent nParent = new Parent(
                joinDto.getUserId(), joinDto.getName(),encodedPass,
                joinDto.getPhoneNumber(), joinDto.getSignedData(), joinDto.getCi());
        Parent sParent = parentRepository.save(nParent);
        return sParent.getName();
    }

    @Override
    public String uploadProfileImage(MultipartFile file) throws IOException {
        ImageDto profileImage  = fileService.uploadImage(file);
        return profileImage.getStoredImagePath();
    }
}
