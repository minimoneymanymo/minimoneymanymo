package com.beautifulyomin.mmmm.domain.member.repository;

import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Integer> {
    Parent findByUserId(String userId);

}
