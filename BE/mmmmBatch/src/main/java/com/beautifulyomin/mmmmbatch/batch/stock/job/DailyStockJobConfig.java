package com.beautifulyomin.mmmmbatch.batch.stock.job;

import com.beautifulyomin.mmmmbatch.batch.stock.step.dailyStock.DailyStockWriter;
import com.beautifulyomin.mmmmbatch.batch.stock.step.dailyStock.DailyStockProcessor;
import com.beautifulyomin.mmmmbatch.batch.stock.step.dailyStock.DailyStockReader;
import com.beautifulyomin.mmmmbatch.listner.JobDurationListener;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.Map;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DailyStockJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager; //트랜젝션 관리
    private final DailyStockReader dailyStockReader;
    private final DailyStockProcessor dailyStockProcessor;
    private final DailyStockWriter dailyStockDataWriter;
    private final JobDurationListener jobDurationListener;

    //jobRepository 를 통해 job의 실행 상태와 메타데이터가 관리된다.
    @Bean
    public Job dailyStockJob() {
        log.info("🔥🔥🔥🔥🔥dailyStockJob");
        return new JobBuilder("dailyStockJob", jobRepository)
                .listener(jobDurationListener)
                .start(dailyStockStep())
                .build();
    }

    @Bean
    public Step dailyStockStep() {
        return new StepBuilder("dailyStockStep", jobRepository)
                .<String, Map<String, Object>>chunk(10, transactionManager) //청크 단위로 트랜젝션
                .reader(dailyStockReader)
                .processor(dailyStockProcessor)
                .writer(dailyStockDataWriter)
                .faultTolerant() // Fault-tolerant 설정 활성화 (예외 허용)
                .skip(Exception.class) // Exception 발생 시 스킵 처리
                .skipLimit(10) // 최대 10번의 예외까지 스킵 허용
                .build();
    }
}