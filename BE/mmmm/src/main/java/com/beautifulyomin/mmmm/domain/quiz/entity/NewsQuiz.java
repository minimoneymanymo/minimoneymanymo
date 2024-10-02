package com.beautifulyomin.mmmmbatch.batch.quiz.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "news_quizzes")
public class NewsQuiz implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contentHtml;

    @Column(nullable = true)
    private String publisher;

    @Column(nullable = true)
    private LocalDateTime publishedDate;

    @Column(nullable = true)
    private String author;

    @Column
    private String question = null;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String options;

    @Column
    private Integer answer = null;




}
