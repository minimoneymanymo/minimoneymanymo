package com.beautifulyomin.mmmm.member.repository;

import com.beautifulyomin.mmmm.member.entity.Children;
import com.beautifulyomin.mmmm.member.entity.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Integer> {
    Optional<Parent>  findByUserId(String userId);
    Optional<Parent> findByPhoneNumber(String phoneNumber);
}
