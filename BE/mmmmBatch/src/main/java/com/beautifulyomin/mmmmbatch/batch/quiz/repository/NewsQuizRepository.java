package com.beautifulyomin.mmmmbatch.batch.quiz.repository;


import com.beautifulyomin.mmmmbatch.batch.quiz.entity.NewsQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsQuizRepository extends JpaRepository<NewsQuiz, Long> {

}