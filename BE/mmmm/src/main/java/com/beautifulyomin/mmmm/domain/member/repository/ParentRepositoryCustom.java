package com.beautifulyomin.mmmm.domain.member.repository;

import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenWaitingDto;

import java.util.List;

public interface ParentRepositoryCustom {
    List<Integer> findAllMyChildrenIdByParentUserId(String parentUserId);
    MyChildrenDto findAllMyChildrenByChildId(Integer childrenId);
    List<MyChildrenWaitingDto> findNotApprovedMyChildrenByParentUserId(String parentUserId);
}
