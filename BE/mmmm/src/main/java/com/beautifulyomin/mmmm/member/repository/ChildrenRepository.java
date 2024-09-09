package com.beautifulyomin.mmmm.member.repository;

import com.beautifulyomin.mmmm.member.entity.Children;
import com.beautifulyomin.mmmm.member.entity.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChildrenRepository extends JpaRepository<Children, Integer> {
    Optional<Children> findByUserId(String userId);
}
