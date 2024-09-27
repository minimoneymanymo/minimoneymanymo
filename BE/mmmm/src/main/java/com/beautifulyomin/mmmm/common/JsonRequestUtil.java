package com.beautifulyomin.mmmm.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Component
public class JsonRequestUtil {

    private final ObjectMapper objectMapper;

    public JsonRequestUtil(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public ObjectNode createRequestBody(String apiName, String userKey) {
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
        headerObject.put("institutionTransactionUniqueNo", transmissionDate + transmissionTime + number);
        headerObject.put("apiKey", "3b3bd8e345c643ce8b0d6bb77d93e649");
        headerObject.put("userKey", userKey);

        jsonObject.set("Header", headerObject);
        return jsonObject;
    }
}

