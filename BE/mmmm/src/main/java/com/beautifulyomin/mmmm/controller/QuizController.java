package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.service.ChildrenService;
import com.beautifulyomin.mmmm.domain.quiz.dto.ResultResponseDTO;
import com.beautifulyomin.mmmm.domain.quiz.entity.NewsQuiz;
import com.beautifulyomin.mmmm.domain.quiz.service.QuizService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;


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
    private final WebClient webClient;

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;


    public QuizController(QuizService quizService, JWTUtil jwtUtil, ChildrenService childrenService, WebClient.Builder webClientBuilder) {
        this.quizService = quizService;
        this.jwtUtil = jwtUtil;
        this.childrenService = childrenService;
        this.webClient = webClientBuilder.baseUrl("https://openapi.naver.com").build();
    }


    @GetMapping("/today")
    public ResponseEntity<CommonResponseDto> getTodayQuizList(@RequestHeader(value = "Authorization", required = false) String token) {
        Integer childrenId = (token != null && !token.isEmpty())
                ? childrenService.findByUserId(jwtUtil.getUsername(token)).getChildrenId() : -1;

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
            @RequestParam String number) {
        NewsQuiz newsQuiz = quizService.getNewsQuiz(Long.parseLong(number));
        Integer childrenId = (token != null && !token.isEmpty())
                ? childrenService.findByUserId(jwtUtil.getUsername(token)).getChildrenId() : -1;
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
            , @RequestBody Map<String, String> requestBody) {
        String option = requestBody.get("option");
        String id = requestBody.get("id");
        System.out.println("제출번호 :" + option);
        Children children = childrenService.findByUserId(jwtUtil.getUsername(token));
        boolean result = quizService.solveQuiz(children, Long.parseLong(id), option);
        return ResponseEntity.ok(
                CommonResponseDto.builder()
                        .stateCode(200)
                        .message("퀴즈 결과!")
                        .data(ResultResponseDTO.builder()
                                .result(result)
                                .bonusMoney(result ? childrenService.solveQuiz(children) : 0)
                                .build())
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<CommonResponseDto> getNewsQuizzes(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Integer childrenId = (token != null && !token.isEmpty())
                ? childrenService.findByUserId(jwtUtil.getUsername(token)).getChildrenId() : -1;
        Page<NewsQuiz> newsQuizzesPage = quizService.getPaginatedNewsQuizzes(page, size);
        List<NewsQuiz> newsQuizList = newsQuizzesPage.getContent();

        CommonResponseDto response = CommonResponseDto.builder()
                .stateCode(200)
                .message("뉴스 퀴즈 페이지네이션")
                .data(quizService.changeNewsQuizToResponseDTO(childrenId, newsQuizList))
                .build();

        return ResponseEntity.ok(response);
    }


    @GetMapping("/search")
    public Mono<ResponseEntity<CommonResponseDto>> getNaverSearch(@RequestParam String company) {
        System.out.println(company);
        System.out.println(clientId);
        System.out.println(clientSecret);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/search/news.json")
                        .queryParam("query", company)
                        .queryParam("display", 10)
                        .queryParam("start", 1)
                        .queryParam("sort", "sim")
                        .build())
                .header("X-Naver-Client-Id", clientId)
                .header("X-Naver-Client-Secret", clientSecret)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> ResponseEntity.ok(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("뉴스 검색 결과")
                        .data(response)
                        .build()))
                .onErrorResume(WebClientResponseException.class, e -> Mono.just(
                        ResponseEntity.status(e.getStatusCode())
                                .body(CommonResponseDto.builder()
                                        .stateCode(e.getStatusCode().value())
                                        .message(e.getMessage())
                                        .data(null)
                                        .build())))
                .onErrorResume(Exception.class, e -> Mono.just(
                        ResponseEntity.status(500)
                                .body(CommonResponseDto.builder()
                                        .stateCode(500)
                                        .message("내부 서버 오류")
                                        .data(null)
                                        .build())));
    }


}