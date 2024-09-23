package com.beautifulyomin.mmmm.domain.member.service;

import com.beautifulyomin.mmmm.common.service.FileService;

import com.beautifulyomin.mmmm.domain.fund.dto.StockHeldDto;
import com.beautifulyomin.mmmm.domain.fund.entity.StocksHeld;
import com.beautifulyomin.mmmm.domain.fund.repository.StocksHeldRepository;
import com.beautifulyomin.mmmm.domain.member.dto.ChildInfoDto;
import com.beautifulyomin.mmmm.domain.member.dto.JoinRequestDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildDto;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.member.entity.ParentAndChildren;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentAndChildrenRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class ChildrenServiceImpl implements ChildrenService {

    private final ChildrenRepository childrenRepository;
    private final ParentRepository parentRepository;
    private final ParentAndChildrenRepository parentAndChildrenRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final FileService fileService;
    private final StocksHeldRepository stocksHeldRepository;

    public ChildrenServiceImpl(ChildrenRepository childrenRepository, ParentRepository parentRepository, ParentAndChildrenRepository parentAndChildrenRepository, BCryptPasswordEncoder bCryptPasswordEncoder, FileService fileService, StocksHeldRepository stocksHeldRepository) {
        this.childrenRepository = childrenRepository;
        this.parentRepository = parentRepository;
        this.parentAndChildrenRepository = parentAndChildrenRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.fileService = fileService;
        this.stocksHeldRepository = stocksHeldRepository;
    }


    @Override
    public String registerChildren(JoinRequestDto joinDto) {
        if(isExistByUserId(joinDto.getUserId())) {
            throw new IllegalArgumentException("이미 사용중인 아이디 입니다");
        }
        Parent parent= parentRepository.findByPhoneNumber(joinDto.getParentsNumber())
                 .orElseThrow(() -> new IllegalArgumentException("해당 번호로 등록된 부모가 없습니다."));
        String encodedPass = bCryptPasswordEncoder.encode(joinDto.getPassword());
        Children children = new Children(
                joinDto.getUserId(), joinDto.getName(), encodedPass,
                joinDto.getPhoneNumber(),joinDto.getBirthDay());
        //자식 저장후
        Children sChildren = childrenRepository.save(children);
        //부모랑 연결
        ParentAndChildren parentAndChildren = new ParentAndChildren(parent, sChildren, false);
        parentAndChildrenRepository.save(parentAndChildren);

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

    @Override
    public ChildInfoDto childInfoByUserId(String userId, String stockCode) {
        Optional<Children> children = childrenRepository.findByUserId(userId);
        if(children.isPresent()){
            Children child = children.get();
            Optional<StocksHeld> stockHeld = stocksHeldRepository.findByChildren_ChildrenIdAndStock_StockCode(child.getChildrenId(), stockCode);

            // StocksHeld 엔티티가 존재하는지 확인하고, 존재하면 totalStockMoney 가져오기
            Integer totalStockMoney = stockHeld.map(StocksHeld::getTotalAmount).orElse(0); // 없으면 0으로 설정

            ChildInfoDto childInfo = new ChildInfoDto();
            childInfo.setUserId(child.getUserId());
            childInfo.setDate(child.getBirthDay());
            childInfo.setMoney(child.getMoney());
            childInfo.setProfileimgUrl(child.getProfileImgUrl());
            childInfo.setStockMoney(totalStockMoney);

            return childInfo;

        } else {
            throw new RuntimeException("Child not found with id: " + userId);
        }

    }

}
