package com.beautifulyomin.mmmm.domain.quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.beautifulyomin.mmmmbatch.batch.quiz.entity.NewsQuiz;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface NewsQuizRepository extends JpaRepository<NewsQuiz, Long> {
    @Query("SELECT n FROM NewsQuiz n WHERE DATE(n.publishedDate) = :today")
    List<NewsQuiz> findAllByPublishedDateToday(LocalDate today);

}