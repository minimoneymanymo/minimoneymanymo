package com.beautifulyomin.mmmmbatch.batch.job;

import com.beautifulyomin.mmmmbatch.batch.step.token.TokenRenewalTasklet;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Slf4j
@Configuration
public class TokenRenewalJobConfig {
    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final TokenRenewalTasklet tokenRenewalTasklet;

    public TokenRenewalJobConfig(JobRepository jobRepository, PlatformTransactionManager transactionManager, TokenRenewalTasklet tokenRenewalTasklet) {
        this.jobRepository = jobRepository;
        this.transactionManager = transactionManager;
        this.tokenRenewalTasklet = tokenRenewalTasklet;
    }

    @Bean
    public Job tokenRenewalJob() {
        log.info("🔥🔥🔥🔥🔥tokenRenewalJob");
        return new JobBuilder("tokenRenewalJob", jobRepository)
                .start(tokenRenewalStep())
                .build();
    }

    private Step tokenRenewalStep() {
        return new StepBuilder("tokenRenewalStep", jobRepository)
                .tasklet(tokenRenewalTasklet, transactionManager)
                .build();
    }
}
