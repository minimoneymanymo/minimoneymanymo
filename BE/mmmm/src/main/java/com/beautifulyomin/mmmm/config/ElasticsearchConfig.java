package com.beautifulyomin.mmmm.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;

@Configuration
public class ElasticsearchConfig extends ElasticsearchConfiguration {
    @Value("${spring_elasticsearch_username}")
    private String username;

    @Value("${spring_elasticsearch_password}")
    private String password;

    @Value("${spring_elasticsearch_uris}")
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
