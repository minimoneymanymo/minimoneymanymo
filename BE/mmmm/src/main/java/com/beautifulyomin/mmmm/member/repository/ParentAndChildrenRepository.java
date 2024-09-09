package com.beautifulyomin.mmmm.member.repository;

import com.beautifulyomin.mmmm.member.entity.ParentAndChildren;
import com.beautifulyomin.mmmm.member.entity.ParentAndChildrenId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParentAndChildrenRepository extends JpaRepository<ParentAndChildren, ParentAndChildrenId> {
}
