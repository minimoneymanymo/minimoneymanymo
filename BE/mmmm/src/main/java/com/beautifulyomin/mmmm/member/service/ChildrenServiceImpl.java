package com.beautifulyomin.mmmm.member.service;

import com.beautifulyomin.mmmm.common.service.FileService;
import com.beautifulyomin.mmmm.member.dto.JoinRequestDto;
import com.beautifulyomin.mmmm.member.entity.Children;
import com.beautifulyomin.mmmm.member.entity.Parent;
import com.beautifulyomin.mmmm.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.member.repository.ParentRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class ChildrenServiceImpl implements ChildrenService{

    private final ChildrenRepository childrenRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final FileService fileService;

    public ChildrenServiceImpl(ChildrenRepository childrenRepository, BCryptPasswordEncoder bCryptPasswordEncoder, FileService fileService) {
        this.childrenRepository = childrenRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.fileService = fileService;
    }


    @Override
    public String registerChildren(JoinRequestDto joinDto) {
        if(isExistByUserId(joinDto.getUserId())) {
            throw new IllegalArgumentException("이미 사용중인 아이디 입니다");
        }
        String encodedPass = bCryptPasswordEncoder.encode(joinDto.getPassword());
        Children children = new Children(
                joinDto.getUserId(), joinDto.getName(), encodedPass,
                joinDto.getPhoneNumber(),joinDto.getBirthDay());
        Children sChildren = childrenRepository.save(children);
        return sChildren.getName();
    }

    @Override
    public String uploadProfileImage(MultipartFile file) throws IOException {
        return "";
    }

    @Override
    public boolean isExistByUserId(String userId) {
        Optional<Children> children = childrenRepository.findByUserId(userId);
        if(children.isPresent())return true;
        else return false;

    }


}
