package com.beautifulyomin.mmmm.member.repository;

import com.beautifulyomin.mmmm.member.entity.Children;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChildrenRepository extends JpaRepository<Children, Integer> {
    Children findByUserId(String userId);
}
