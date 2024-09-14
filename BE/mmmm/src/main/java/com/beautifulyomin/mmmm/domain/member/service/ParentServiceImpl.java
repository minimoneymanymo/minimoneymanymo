package com.beautifulyomin.mmmm.domain.member.service;

import com.beautifulyomin.mmmm.common.dto.ImageDto;
import com.beautifulyomin.mmmm.common.service.FileService;
import com.beautifulyomin.mmmm.domain.member.dto.JoinRequestDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenWaitingDto;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.member.entity.ParentAndChildren;
import com.beautifulyomin.mmmm.domain.member.repository.ParentAndChildrenRepository;
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
    private final ParentAndChildrenRepository parentAndChildrenRepository;
    private final FileService fileService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    public ParentServiceImpl(ParentRepository parentRepository, ParentRepositoryCustom parentRepositoryCustom, ParentAndChildrenRepository parentAndChildrenRepository, FileService fileService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.parentRepository = parentRepository;
        this.parentRepositoryCustom = parentRepositoryCustom;
        this.parentAndChildrenRepository = parentAndChildrenRepository;
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

    @Override
    public List<MyChildrenWaitingDto> getMyChildWaiting(String userId) {
        return parentRepositoryCustom.findNotApprovedMyChildrenByParentUserId(userId);
    }

    @Override
    public int addMyChildren(String parentUserId, Integer childrenId) {
        Parent parent = parentRepository.findByUserId(parentUserId)
                .orElseThrow(() -> new RuntimeException("부모 아이디 없음" + parentUserId));
        Integer parentId = parent.getParentId();

        Optional<ParentAndChildren> parentAndChildrenTrue = parentAndChildrenRepository.findByParent_ParentIdAndChild_ChildrenIdAndIsApprovedTrue(parentId, childrenId);
        Optional<ParentAndChildren> parentAndChildrenFalse = parentAndChildrenRepository.findByParent_ParentIdAndChild_ChildrenIdAndIsApprovedFalse(parentId, childrenId);

        // 이미 수락된 경우 -1 반환
        if(parentAndChildrenTrue.isPresent() ){
            return -1;
        }
        // 승인 대기 중인 경우에 실행
        if(parentAndChildrenFalse.isPresent()){
            long result = parentRepositoryCustom.updateIsApprovedById(parentId,childrenId);
            // 바뀐행이 1 이상인경우 요청 승인 성공 (여러 요청이 있을경우 다 수락하여 준다.)
            // 성공인 경우 1 반환
            if(result >= 1){
                return 1;
            }
        }

        // 이외의 경우 (목록에 parentId,childrenId 인 행이없는경우, 바뀐행이 2개 이상인경우) 0 :에러 반환
        return 0;
    }

}
