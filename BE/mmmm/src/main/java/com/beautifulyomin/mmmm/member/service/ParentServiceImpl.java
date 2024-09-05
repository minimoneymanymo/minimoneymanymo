package com.beautifulyomin.mmmm.member.service;

import com.beautifulyomin.mmmm.common.dto.ImageDto;
import com.beautifulyomin.mmmm.common.service.FileService;
import com.beautifulyomin.mmmm.member.dto.ParentRegistrationDto;
import com.beautifulyomin.mmmm.member.entity.Parent;
import com.beautifulyomin.mmmm.member.repository.ParentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ParentServiceImpl implements ParentService {

    private final ParentRepository parentRepository;
    private final FileService fileService;

    public ParentServiceImpl(ParentRepository parentRepository, FileService fileService) {
        this.parentRepository = parentRepository;
        this.fileService = fileService;
    }

    public String registerParent(ParentRegistrationDto parentDto) {
        Parent nParent = new Parent(
                parentDto.getUserId(), parentDto.getName(), parentDto.getPassword(),
                parentDto.getPhoneNumber(), parentDto.getSignedData(), parentDto.getCi());
        Parent sParent = parentRepository.save(nParent);
        return sParent.getName();
    }

    @Override
    public String uploadProfileImage(MultipartFile file) throws IOException {
        ImageDto profileImage  = fileService.uploadImage(file);
        return profileImage.getStoredImagePath();
    }
}
