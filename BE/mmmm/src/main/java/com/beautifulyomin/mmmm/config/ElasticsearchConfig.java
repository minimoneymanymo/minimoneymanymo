package com.beautifulyomin.mmmm.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;

@Configuration
public class ElasticsearchConfig extends ElasticsearchConfiguration {
    @Value("${SPRING_ELASICSEARCH_USERNAME}")
    private String username;

    @Value("${SPRING_ELASICSEARCH_PASSWORD}")
    private String password;

    @Value("${SPRING_ELASICSEARCH_URIS}")
    private String esHost;

    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo(esHost)
                .usingSsl()
                .withBasicAuth(username, password)
                .build();
    }
}
