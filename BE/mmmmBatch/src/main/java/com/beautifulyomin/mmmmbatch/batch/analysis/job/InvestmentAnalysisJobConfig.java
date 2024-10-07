package com.beautifulyomin.mmmmbatch.batch.analysis.job;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.Children;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReport;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReportV2;
import com.beautifulyomin.mmmmbatch.batch.analysis.step.report.InvestmentAnalysisProcessor;
import com.beautifulyomin.mmmmbatch.batch.analysis.step.report.InvestmentAnalysisReader;
import com.beautifulyomin.mmmmbatch.batch.analysis.step.report.InvestmentAnalysisWriter;
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

@Slf4j
@Configuration
@RequiredArgsConstructor
public class InvestmentAnalysisJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final InvestmentAnalysisReader investmentAnalysisReader;
    private final InvestmentAnalysisProcessor investmentAnalysisProcessor;
    private final InvestmentAnalysisWriter investmentAnalysisWriter;
    private final JobDurationListener jobDurationListener;

    @Bean
    public Job investmentAnalysisJob() {
        return new JobBuilder("investmentAnalysisJob", jobRepository)
                .listener(jobDurationListener)
                .start(tradingFrequencyStep())
                .build();
    }

    @Bean
    public Step tradingFrequencyStep() {
        return new StepBuilder("tradingFrequencyStep", jobRepository)
                .<Children, InvestmentReportV2>chunk(10, transactionManager)
                .reader(investmentAnalysisReader)
                .processor(investmentAnalysisProcessor)
                .writer(investmentAnalysisWriter)
                .build();
    }
}