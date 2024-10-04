package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.service.ChildrenService;
import com.beautifulyomin.mmmm.domain.quiz.entity.NewsQuiz;
import com.beautifulyomin.mmmm.domain.quiz.service.QuizService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/quiz")
public class QuizController {
    private final QuizService quizService;
    private final JWTUtil jwtUtil;
    private final ChildrenService childrenService;

    public QuizController(QuizService quizService, JWTUtil jwtUtil, ChildrenService childrenService) {
        this.quizService = quizService;
        this.jwtUtil = jwtUtil;
        this.childrenService = childrenService;
    }


    @GetMapping("/today")
    public ResponseEntity<CommonResponseDto> getTodayQuizList(@RequestHeader(value = "Authorization", required = false) String token) {
        Integer childrenId = (token != null && !token.isEmpty())
                ? childrenService.findByUserId(jwtUtil.getUsername(token)).getChildrenId(): -1;

        List<NewsQuiz> newsQuizList = quizService.findAllByPublishedDateTodayNewsQuizzes();
        return ResponseEntity.ok(
                CommonResponseDto.builder()
                        .stateCode(200)
                        .message("오늘의 퀴즈!")
                        .data(quizService.changeNewsQuizToResponseDTO(childrenId, newsQuizList))
                        .build()
        );
    }

    @GetMapping("/detail")
    public ResponseEntity<CommonResponseDto> getNewsDetail(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam String number){
        NewsQuiz newsQuiz =  quizService.getNewsQuiz(Long.parseLong(number));
        Integer childrenId = (token != null && !token.isEmpty())
                ? childrenService.findByUserId(jwtUtil.getUsername(token)).getChildrenId(): -1;
        return ResponseEntity.ok(
                CommonResponseDto.builder()
                        .stateCode(200)
                        .message("퀴즈 디테일!")
                        .data(quizService.changeNewsQuizToResponseDTO(childrenId, Collections.singletonList(newsQuiz)))
                        .build()
        );
    }
    @PostMapping("/solve")
    public ResponseEntity<CommonResponseDto> solveQuize(
            @RequestHeader(value = "Authorization") String token
            , @RequestBody Map<String, String> requestBody){
        String option = requestBody.get("option");
        String id = requestBody.get("id");
        System.out.println(option);
        System.out.println(id);
        Children children =  childrenService.findByUserId(jwtUtil.getUsername(token));
        return ResponseEntity.ok(
                CommonResponseDto.builder()
                        .stateCode(200)
                        .message("퀴즈 결과!")
                        .data(quizService.solveQuiz(children,Long.parseLong(id),option))
                        .build()
        );
    }


}
