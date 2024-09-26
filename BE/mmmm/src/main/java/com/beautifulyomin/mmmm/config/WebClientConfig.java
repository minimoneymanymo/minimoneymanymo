package com.beautifulyomin.mmmm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;

public class WebClientConfig {

    @Bean
    public WebClient webClientBuilder(){
        return WebClient.builder()
                .baseUrl("https://finopenapi.ssafy.io/ssafy/api/v1/edu")
                .build();
    }
}
