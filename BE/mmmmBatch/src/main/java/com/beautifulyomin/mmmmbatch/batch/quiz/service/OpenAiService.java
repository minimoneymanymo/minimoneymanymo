package com.beautifulyomin.mmmmbatch.batch.quiz.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;


@Service
public class OpenAiService {

    private static final String API_URL = "https://api.openai.com/v1/chat/completions";

    @Value("${openai.api.key}")
    private String apiKey;

    // 시스템 메시지를 추가하여 퀴즈 생성
    public String generateQuiz(String userPrompt) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");
        //미리 설정할 프롬프트
        String roleDefinitionPrompt = "당신은 한국어로 작성된 경제 뉴스 기사를 기반으로 한국어로 된 다지선다 질문을 만들어야 한다 " +
                "질문을 만들 때는 반드시 다음 기준을 준수해야 한다: " +
                "1. 독자가 뉴스 기사를 충분히 이해했는지를 평가할 수 있는 질문을 만들어야 한다. 단 문제 내용이 단순하게 수치(가격, 기간)등을 물어보는 내용은 안된다 " +
                "2. 만약 1번의 기사내용이 부족하면 기사에서 논의된 어려운 경제 용어에 대한 이해도를 측정하는 문제를 생성해야 한다 " +
                "3. 중학생 또는 초등학생이 풀어야 하므로 질문 어투는 ~인가요? ~ 하나요? 같은 친절한 말투를 사용한다"+
                "정답의 ID도 함께 제공해야 한다 "+
                "너의 답변은 반드시 JSON 형식으로 다음과 같이 작성해야 한다: " +
                "{\"question\": \"What is the capital of France?\", " +
                "\"options\": [{\"id\": 1, \"text\": \"Berlin\"}, " +
                "{\"id\": 2, \"text\": \"Madrid\"}, " +
                "{\"id\": 3, \"text\": \"Paris\"}, " +
                "{\"id\": 4, \"text\": \"Rome\"}, " +
                "{\"id\": 5, \"text\": \"Lisbon\"}], " +
                "\"correctAnswerId\": 3}";


        // 요청 바디 설정
        Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(
                        Map.of("role", "system", "content", roleDefinitionPrompt),
                        Map.of("role", "user", "content", userPrompt)
                ),
                "max_tokens", 500,
                "temperature", 0.7
        );

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        // API 호출
        ResponseEntity<Map> response = restTemplate.exchange(API_URL, HttpMethod.POST, requestEntity, Map.class);

        // 응답에서 텍스트 추출
        Map<String, Object> responseBody = response.getBody();
        if (responseBody != null) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, String> message = (Map<String, String>) choices.get(0).get("message");
            return message.get("content");
        }
        return "퀴즈를 생성할 수 없습니다.";
    }
}
