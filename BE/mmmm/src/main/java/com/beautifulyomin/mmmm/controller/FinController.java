package com.beautifulyomin.mmmm.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@RestController
@RequestMapping("/fin")
@RequiredArgsConstructor
public class FinController {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public ObjectNode createRequestBody(String apiName) {
        // JSON 객체 생성
        ObjectNode jsonObject = objectMapper.createObjectNode();
        ObjectNode headerObject = objectMapper.createObjectNode();

        // 현재 시간 가져오기
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HHmmss");
        String transmissionDate = now.format(dateFormatter);
        String transmissionTime = now.format(timeFormatter);

        // 난수 생성
        Random random = new Random();
        String number = String.format(String.valueOf(random.nextInt(1000000)));

        // Header 설정
        headerObject.put("apiName", apiName);
        headerObject.put("transmissionDate", transmissionDate);
        headerObject.put("transmissionTime", transmissionTime);
        headerObject.put("institutionCode", "00100");
        headerObject.put("fintechAppNo", "001");
        headerObject.put("apiServiceCode", apiName);
        headerObject.put("institutionTransactionUniqueNo", transmissionDate+transmissionTime+number);
        headerObject.put("apiKey", "3b3bd8e345c643ce8b0d6bb77d93e649");
        headerObject.put("userKey", "543547f2-c269-4f43-bc9a-dbb89d916694");

        // Header를 jsonObject에 설정
        jsonObject.set("Header", headerObject);

        return jsonObject;
    }

    @PostMapping("/inquireBankCodes")
    public Mono<String> inquireBankCodes() {
        // JSON 객체 생성
        ObjectNode jsonObject = createRequestBody("inquireBankCodes");
        System.out.println("🎈🎈🎈🎈🎈🎈🎈");
        System.out.println(jsonObject);

        return webClient.post()
                .uri("/bank/inquireBankCodes") // URI에서 기본 URL 제외
                .bodyValue(jsonObject)
                .retrieve()
                .bodyToMono(String.class);
    }
}
