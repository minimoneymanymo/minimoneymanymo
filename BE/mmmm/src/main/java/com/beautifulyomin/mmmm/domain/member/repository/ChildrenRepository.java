package com.beautifulyomin.mmmm.domain.member.repository;


import com.beautifulyomin.mmmm.domain.member.entity.Children;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChildrenRepository extends JpaRepository<Children, Integer> {
    Optional<Children> findByUserId(String userId);
    Optional<Children> findChildrenByChildrenId(Integer childrenId);
}
