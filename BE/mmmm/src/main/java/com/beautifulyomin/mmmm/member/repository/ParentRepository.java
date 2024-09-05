package com.beautifulyomin.mmmm.member.repository;

import com.beautifulyomin.mmmm.member.entity.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Integer> {
}
