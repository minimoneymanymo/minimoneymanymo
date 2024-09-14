package com.beautifulyomin.mmmm.domain.member.repository;

import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenDto;

import java.util.List;

public interface ParentRepositoryCustom {
    List<Integer> findAllMyChildrenIdByParentUserId(String parentUserId);
    MyChildrenDto findAllMyChildrenByChildUserId(Integer childrenId);
}
