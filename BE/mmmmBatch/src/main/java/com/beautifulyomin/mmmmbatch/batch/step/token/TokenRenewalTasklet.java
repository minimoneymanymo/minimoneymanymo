package com.beautifulyomin.mmmmbatch.batch.step.token;

import com.beautifulyomin.mmmmbatch.batch.step.TokenStore;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Slf4j
@Component
public class TokenRenewalTasklet implements Tasklet {

    private final TokenStore tokenStore;
    private final RestTemplate restTemplate;
    @Value("${kis_renew_token_api}")
    private String RENUE_TOKEN_API_URL;

    @Value("${kis_prod_appkey}")
    private String PROD_APPKEY;

    @Value("${kis_api_secret}")
    private String PROD_APPSECRET;

    public TokenRenewalTasklet(TokenStore tokenStore, RestTemplate restTemplate) {
        this.tokenStore = tokenStore;
        this.restTemplate = restTemplate;
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        String newToken = renewToken();
        tokenStore.saveToken(newToken);
        return RepeatStatus.FINISHED;
    }

    private String renewToken() {
        URI uri = UriComponentsBuilder.fromUriString(RENUE_TOKEN_API_URL)
                .encode()
                .build()
                .toUri();

        // API 호출을 위한 헤더 설정
        var headers = new org.springframework.http.HttpHeaders();
        headers.set("content-type", "application/json");

        // HTTP 요청 생성
        JSONObject requestBody = new JSONObject();
        requestBody.put("grant_type", "client_credentials");
        requestBody.put("appkey", PROD_APPKEY);
        requestBody.put("appsecret", PROD_APPSECRET);

        var request = new org.springframework.http.HttpEntity<>(requestBody.toString(), headers);

        // API 호출
        var response = restTemplate.exchange(uri, HttpMethod.POST, request, String.class);

        // 응답 처리
        JSONObject jsonResponse = new JSONObject(response.getBody());
        String token= jsonResponse.getString("access_token");

        log.info("🌟🌟🌟🌟🌟 access token::{}", token);
        return token;
    }

}
