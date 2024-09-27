package com.beautifulyomin.mmmmbatch.batch.quiz.job;


import com.beautifulyomin.mmmmbatch.batch.quiz.step.CreateQuizTasklet;
import com.beautifulyomin.mmmmbatch.batch.quiz.step.WebCrawlingTasklet;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;

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
    private final CreateQuizTasklet createQuiz;
    private final WebCrawlingTasklet webCrawlingTasklet;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;

    public QuizJobConfig(CreateQuizTasklet createQuiz, WebCrawlingTasklet webCrawlingTasklet, JobRepository jobRepository, PlatformTransactionManager platformTransactionManager) {
        this.createQuiz = createQuiz;
        this.webCrawlingTasklet = webCrawlingTasklet;
        this.jobRepository = jobRepository;
        this.platformTransactionManager = platformTransactionManager;
    }

    @Bean
    public Job newsQuizJob() {
        return new JobBuilder("newsQuizJob", jobRepository)
                .start(webCrawlingStep())
                .next(createQuizStep()) // 두 번째 Step 추가
                .build();
    }

    @Bean
    public Step webCrawlingStep() {
        return new StepBuilder("webCrawlingStep", jobRepository)
                .tasklet(webCrawlingTasklet, platformTransactionManager)
                .build();
    }

    @Bean
    public Step createQuizStep() {
        return new StepBuilder("createQuizStep", jobRepository)
                .tasklet(createQuiz, platformTransactionManager) // 동일한 Tasklet을 사용
                .build();
    }
}