package com.beautifulyomin.mmmmbatch.batch.quiz.job;

import com.beautifulyomin.mmmmbatch.batch.quiz.step.WebCrawlingTasklet;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.JobStepBuilder;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.builder.StepBuilderHelper;
import org.springframework.batch.core.step.builder.TaskletStepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Slf4j
@Configuration
@EnableBatchProcessing
public class  QuizJobConfig {

    private final WebCrawlingTasklet webCrawlingTasklet;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;

    public QuizJobConfig(WebCrawlingTasklet webCrawlingTasklet, JobRepository jobRepository, PlatformTransactionManager platformTransactionManager) {
        this.webCrawlingTasklet = webCrawlingTasklet;
        this.jobRepository = jobRepository;
        this.platformTransactionManager = platformTransactionManager;
    }

    @Bean
    public Job webCrawlingJob() {
        return new JobBuilder("webCrawlingJob", jobRepository)
                .start(webCrawlingStep())
                .build();
    }

    @Bean
    public Step webCrawlingStep() {
        return new StepBuilder("webCrawlingStep", jobRepository)
                .tasklet(webCrawlingTasklet,platformTransactionManager)
                .build();
    }

}