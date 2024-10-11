package com.beautifulyomin.mmmm.domain.quiz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "news_quizzes")
public class NewsQuiz implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 기본 키

    @Column(nullable = false)
    private String title; // 제목

    @Column(nullable =true)
    private String imageUrl;

    @Column
    private String url;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // 내용

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contentHtml; // 내용 (HTML 포함)

    @Column(nullable = true)
    private String publisher; // 언론사

    @Column(nullable = true)
    private LocalDateTime publishedDate; // 게시 날짜

    @Column(nullable = true)
    private String author; // 기자 이름

    @Column
    private String question = null;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String options; // 선지별로 구분 문자열 필수

    @Column
    private Integer answer = null;








}
