package com.beautifulyomin.mmmm.domain.member.service;

import com.beautifulyomin.mmmm.common.dto.ImageDto;
import com.beautifulyomin.mmmm.common.service.FileService;

import com.beautifulyomin.mmmm.domain.fund.entity.StocksHeld;
import com.beautifulyomin.mmmm.domain.fund.repository.StocksHeldRepository;
import com.beautifulyomin.mmmm.domain.member.dto.ChildInfoDto;
import com.beautifulyomin.mmmm.domain.member.dto.JoinRequestDto;
import com.beautifulyomin.mmmm.domain.member.dto.PasswordDto;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.member.entity.ParentAndChildren;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentAndChildrenRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentRepository;

import com.beautifulyomin.mmmm.domain.member.repository.ParentRepositoryCustom;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Optional;

@Service
public class ChildrenServiceImpl implements ChildrenService {

    private final ChildrenRepository childrenRepository;
    private final ParentRepositoryCustom parentRepositoryCustom;
    private final ParentRepository parentRepository;
    private final ParentAndChildrenRepository parentAndChildrenRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final StocksHeldRepository stocksHeldRepository;
    private final FileService fileService;

    public ChildrenServiceImpl(ChildrenRepository childrenRepository, ParentRepositoryCustom parentRepositoryCustom, ParentRepository parentRepository, ParentAndChildrenRepository parentAndChildrenRepository, BCryptPasswordEncoder bCryptPasswordEncoder, StocksHeldRepository stocksHeldRepository, FileService fileService) {
        this.childrenRepository = childrenRepository;
        this.parentRepositoryCustom = parentRepositoryCustom;
        this.parentRepository = parentRepository;
        this.parentAndChildrenRepository = parentAndChildrenRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.stocksHeldRepository = stocksHeldRepository;
        this.fileService = fileService;
    }


    @Override
    public String registerChildren(JoinRequestDto joinDto) {
        if (isExistByUserId(joinDto.getUserId())) {
            throw new IllegalArgumentException("이미 사용중인 아이디 입니다");
        }
        Parent parent = parentRepository.findByPhoneNumber(joinDto.getParentsNumber())
                .orElseThrow(() -> new IllegalArgumentException("해당 번호로 등록된 부모가 없습니다."));
        String encodedPass = bCryptPasswordEncoder.encode(joinDto.getPassword());
        Children children = new Children(
                joinDto.getUserId(),
                joinDto.getName(),
                encodedPass,
                joinDto.getPhoneNumber(),
                joinDto.getBirthDay(),
                joinDto.getUserKey()
        );
        //자식 저장후
        Children sChildren = childrenRepository.save(children);
        //부모랑 연결
        ParentAndChildren parentAndChildren = new ParentAndChildren(parent, sChildren, false);
        parentAndChildrenRepository.save(parentAndChildren);

        return sChildren.getName();
    }

    @Override
    public String uploadProfileImage(MultipartFile file, String userId) throws IOException {
        ImageDto profileImage = fileService.uploadImage(file);
        Children children = childrenRepository.findByUserId(userId).orElseThrow();
        children.setProfileImgUrl(profileImage.getStoredImagePath());
        childrenRepository.save(children);
        return profileImage.getStoredImagePath();
    }

    @Override
    public boolean isExistByUserId(String userId) {
        Optional<Children> children = childrenRepository.findByUserId(userId);
        if (children.isPresent()) return true;
        else return false;

    }

    @Override
    public ChildInfoDto childInfoByUserId(String userId, String stockCode) {
        Optional<Children> children = childrenRepository.findByUserId(userId);
        if (children.isPresent()) {
            Children child = children.get();
            Optional<StocksHeld> stockHeld = stocksHeldRepository.findByChildren_ChildrenIdAndStock_StockCode(child.getChildrenId(), stockCode);

            // StocksHeld 엔티티가 존재하는지 확인하고, 존재하면 totalStockMoney 가져오기
            Integer totalStockMoney = stockHeld.map(StocksHeld::getTotalAmount).orElse(0); // 없으면 0으로 설정
            BigDecimal totalStockShares = stockHeld.map(StocksHeld::getRemainSharesCount).orElse(BigDecimal.valueOf(0));

            ChildInfoDto childInfo = new ChildInfoDto();
            childInfo.setUserId(child.getUserId());
            childInfo.setDate(child.getBirthDay());
            childInfo.setMoney(child.getMoney());
            childInfo.setProfileimgUrl(child.getProfileImgUrl());
            childInfo.setStockMoney(totalStockMoney);
            childInfo.setRemainSharesCount(totalStockShares);

            return childInfo;

        } else {
            throw new RuntimeException("Child not found with id: " + userId);
        }
    }

    @Override
    public int solveQuiz(Children children) {
        int bonusMoney = children.getSettingQuizBonusMoney();
        int resultMoney = children.getMoney() + bonusMoney;
        children.setMoney(resultMoney);
        childrenRepository.save(children);
        return bonusMoney;

    }

    @Override
    public String updateChildPassword(PasswordDto passwordDto) {
        Children children = childrenRepository.findByUserId(passwordDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        String encodedPass = bCryptPasswordEncoder.encode(passwordDto.getPassword());
        children.setPassword(encodedPass);
        Children updatedChildren = childrenRepository.save(children);
        return updatedChildren.getName();
    }

    @Override
    public long updateAccount(String childUserId, String accountNumber, String bankCode) {
        return parentRepositoryCustom.updateChildAccount(childUserId, accountNumber, bankCode);
    }

    @Override
    public Children findByUserId(String childUserId) {
        return childrenRepository.findByUserId(childUserId).orElseThrow(() -> new RuntimeException("아이디 없음" + childUserId));
    }
}
