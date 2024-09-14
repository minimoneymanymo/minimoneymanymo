package com.beautifulyomin.mmmmbatch.batch.job;

import com.beautifulyomin.mmmmbatch.batch.entity.DailyStockData;
import com.beautifulyomin.mmmmbatch.batch.step.dailyStock.DailyStockDataWriter;
import com.beautifulyomin.mmmmbatch.batch.step.dailyStock.DailyStockDataProcessor;
import com.beautifulyomin.mmmmbatch.batch.step.dailyStock.DailyStockDataReader;
import com.beautifulyomin.mmmmbatch.listner.JobDurationListener;
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
public class DailyStockDataJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager; //트랜젝션 관리
    private final DailyStockDataReader dailyStockDataReader;
    private final DailyStockDataProcessor dailyStockDataProcessor;
    private final DailyStockDataWriter dailyStockDataWriter;
    private final JobDurationListener jobDurationListener;

    public DailyStockDataJobConfig(JobRepository jobRepository,
                                   PlatformTransactionManager transactionManager,
                                   DailyStockDataReader dailyStockDataReader,
                                   DailyStockDataProcessor dailyStockDataProcessor,
                                   DailyStockDataWriter dailyStockDataWriter, JobDurationListener jobDurationListener) {
        this.jobRepository = jobRepository;
        this.transactionManager = transactionManager;
        this.dailyStockDataReader = dailyStockDataReader;
        this.dailyStockDataProcessor = dailyStockDataProcessor;
        this.dailyStockDataWriter = dailyStockDataWriter;
        this.jobDurationListener = jobDurationListener;
    }

    //jobRepository 를 통해 job의 실행 상태와 메타데이터가 관리된다.
    @Bean
    public Job importDailyStockDataJob() {
        log.info("🔥🔥🔥잡 실행");
        return new JobBuilder("importDailyStockDataJob", jobRepository)
                .listener(jobDurationListener)
                .start(importDailyStockDataStep())
                .build();
    }

    @Bean
    public Step importDailyStockDataStep() {
        return new StepBuilder("importDailyStockDataStep", jobRepository)
                .<String, DailyStockData>chunk(10, transactionManager) //청크 단위로 트랜젝션
                .reader(dailyStockDataReader)
                .processor(dailyStockDataProcessor)
                .writer(dailyStockDataWriter)
                .build();
    }
}