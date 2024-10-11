package com.beautifulyomin.mmmm.domain.quiz.dto;

import com.beautifulyomin.mmmm.domain.quiz.entity.NewsQuiz;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NewsQuizResponseDTO {
    private NewsQuiz newsQuiz;
    private int isQuizAnswered;
}
