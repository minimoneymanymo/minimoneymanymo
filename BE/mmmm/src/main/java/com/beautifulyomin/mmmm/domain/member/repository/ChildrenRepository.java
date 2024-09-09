package com.beautifulyomin.mmmm.domain.member.repository;

import com.beautifulyomin.mmmm.domain.member.entity.Children;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChildrenRepository extends JpaRepository<Children, Integer> {
    Children findByUserId(String userId);
}
