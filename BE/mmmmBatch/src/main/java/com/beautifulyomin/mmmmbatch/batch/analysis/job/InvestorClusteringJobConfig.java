package com.beautifulyomin.mmmmbatch.batch.analysis.job;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster.InvestorCluster;
import com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster.InvestorData;
import com.beautifulyomin.mmmmbatch.batch.analysis.step.cluster.InvestorClusterProcessor;
import com.beautifulyomin.mmmmbatch.batch.analysis.step.cluster.InvestorClusterReader;
import com.beautifulyomin.mmmmbatch.batch.analysis.step.cluster.InvestorClusterWriter;
import com.beautifulyomin.mmmmbatch.batch.stock.step.token.TokenRenewalTasklet;
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

@Slf4j
@Configuration
@RequiredArgsConstructor
public class InvestorClusteringJobConfig {
    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final InvestorClusterReader investorClusterReader;
    private final InvestorClusterProcessor investorClusterProcessor;
    private final InvestorClusterWriter investorClusterWriter;


    @Bean
    public Job investorClusteringJob() {
        log.info("🔥🔥🔥🔥🔥investorClusteringJob");
        return new JobBuilder("investorClusteringJob", jobRepository)
                .start(investorClusteringStep())
                .build();
    }

    @Bean
    public Step investorClusteringStep() {
        return new StepBuilder("investorClusteringStep", jobRepository)
                .<InvestorData, InvestorCluster>chunk(1, transactionManager)
                .reader(investorClusterReader)
                .processor(investorClusterProcessor)
                .writer(investorClusterWriter)
                .build();
    }
}
