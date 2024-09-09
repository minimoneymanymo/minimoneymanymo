package com.beautifulyomin.mmmm.domain.member.repository;


import com.beautifulyomin.mmmm.domain.member.entity.ParentAndChildren;
import com.beautifulyomin.mmmm.domain.member.entity.ParentAndChildrenId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParentAndChildrenRepository extends JpaRepository<ParentAndChildren, ParentAndChildrenId> {
}
