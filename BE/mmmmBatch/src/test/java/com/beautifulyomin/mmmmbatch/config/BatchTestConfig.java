package com.beautifulyomin.mmmmbatch.config;

import com.beautifulyomin.mmmmbatch.batch.stock.job.DailyStockJobConfig;
import com.beautifulyomin.mmmmbatch.batch.stock.job.TokenRenewalJobConfig;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@TestPropertySource(locations = "classpath:application-test.properties")
@Configuration
@EnableBatchProcessing
@Import({TokenRenewalJobConfig.class, DailyStockJobConfig.class})
public class BatchTestConfig {

    @Value("${spring.datasource.url}")
    private String dbUrl;
    @Value("${spring.datasource.username}")
    private String dbUsername;
    @Value("${spring.datasource.password}")
    private String dbPassword;
    @Value("${spring.datasource.driver-class-name}")
    private String driver;


    @Bean
    public JobParameters jobParameters() {
        return new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();
    }

    @Bean
//    @Primary //하면 jpa와 공통 datasource 사용하게 됨 (일관성)
    public DataSource dataSource() {
        return DataSourceBuilder.create()
                .url(dbUrl)
                .username(dbUsername)
                .password(dbPassword)
                .driverClassName(driver)
                .build();
    }

    @Bean
    public PlatformTransactionManager transactionManager() {
        return new DataSourceTransactionManager(dataSource());
    }
}
