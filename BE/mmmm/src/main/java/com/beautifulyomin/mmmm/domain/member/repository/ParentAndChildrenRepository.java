package com.beautifulyomin.mmmm.domain.member.repository;


import com.beautifulyomin.mmmm.domain.member.entity.ParentAndChildren;
import com.beautifulyomin.mmmm.domain.member.entity.ParentAndChildrenId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParentAndChildrenRepository extends JpaRepository<ParentAndChildren, ParentAndChildrenId> {
    Optional<ParentAndChildren> findByParent_ParentIdAndChild_ChildrenIdAndIsApprovedFalse(Integer parentId, Integer childrenId);
    Optional<ParentAndChildren> findByParent_ParentIdAndChild_ChildrenIdAndIsApprovedTrue(Integer parentId, Integer childrenId);
}
