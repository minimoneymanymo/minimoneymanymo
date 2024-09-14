package com.beautifulyomin.mmmm.domain.member.service;

import com.beautifulyomin.mmmm.common.dto.ImageDto;
import com.beautifulyomin.mmmm.common.service.FileService;
import com.beautifulyomin.mmmm.domain.member.dto.JoinRequestDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenDto;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.member.repository.ParentRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentRepositoryCustom;
import org.springframework.core.SpringVersion;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ParentServiceImpl implements ParentService {

    private final ParentRepository parentRepository;
    private final ParentRepositoryCustom parentRepositoryCustom;
    private final FileService fileService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    public ParentServiceImpl(ParentRepository parentRepository, ParentRepositoryCustom parentRepositoryCustom, FileService fileService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.parentRepository = parentRepository;
        this.parentRepositoryCustom = parentRepositoryCustom;
        this.fileService = fileService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public String registerParent(JoinRequestDto joinDto) {
        if(isExistByUserId(joinDto.getUserId())){
            throw new IllegalArgumentException("이미 사용중인 아이디 입니다");
        }
        if(isExistByPhoneNumber(joinDto.getPhoneNumber())){
            throw new IllegalArgumentException("이미 사용중인 번호입니다.");
        }
        String encodedPass = bCryptPasswordEncoder.encode(joinDto.getPassword());

        Parent nParent = new Parent(
                joinDto.getUserId(), joinDto.getName(),encodedPass,
                joinDto.getPhoneNumber());
        Parent sParent = parentRepository.save(nParent);
        return sParent.getName();
    }

    @Override
    public String uploadProfileImage(MultipartFile file) throws IOException {
        ImageDto profileImage  = fileService.uploadImage(file);
        return profileImage.getStoredImagePath();
    }

    @Override
    public boolean isExistByUserId(String userId) {
        Optional<Parent> parent =  parentRepository.findByUserId(userId);
        if(parent.isPresent())return true;
        else return false;
    }

    @Override
    public boolean isExistByPhoneNumber(String phoneNumber) {
        Optional<Parent> parent =  parentRepository.findByPhoneNumber(phoneNumber);
        if(parent.isPresent())return true;
        else return false;
    }

    @Override
    public List<MyChildrenDto> getMyChildren(String userId) {
        List<Integer> childrenIdList = parentRepositoryCustom.findAllMyChildrenIdByParentUserId(userId);
        List<MyChildrenDto> childList = new ArrayList<>();
        for(Integer myChildrenId : childrenIdList){
            childList.add(parentRepositoryCustom.findAllMyChildrenByChildId(myChildrenId));
        }
        return childList;
    }

}
