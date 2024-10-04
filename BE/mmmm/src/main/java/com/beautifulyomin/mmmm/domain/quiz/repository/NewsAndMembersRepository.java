package com.beautifulyomin.mmmm.domain.quiz.repository;

import com.beautifulyomin.mmmm.domain.quiz.entity.NewsAndMember;
import com.beautifulyomin.mmmm.domain.quiz.entity.key.NewsAndMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsAndMembersRepository extends JpaRepository<NewsAndMember, NewsAndMemberId> {
    List<NewsAndMember> findAllByIdChildrenId(int childrenId);
}
