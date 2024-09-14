package com.beautifulyomin.mmmmbatch.batch.stock.job;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.JobStepBuilder;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MainJobConfig { //각각의 job을 연결하는 jog flow
    private final JobRepository jobRepository;
    private final Job tokenRenewalJob;
    private final Job dailyStockJob;
    private final JobLauncher jobLauncher;

    public MainJobConfig(JobRepository jobRepository,
                         Job tokenRenewalJob, Job dailyStockJob, JobLauncher jobLauncher) {
        this.jobRepository = jobRepository;
        this.tokenRenewalJob = tokenRenewalJob;
        this.dailyStockJob = dailyStockJob;
        this.jobLauncher = jobLauncher;
    }

    @Bean
    public Job mainJob() {
        return new JobBuilder("mainJob", jobRepository)
                .start(tokenRenewalJobStep())
                .next(dailyStockDataJobStep())
                .build();

    }

    @Bean
    public Step tokenRenewalJobStep() {
        return new JobStepBuilder(new StepBuilder("tokenRenewalJobStep", jobRepository))
                .job(tokenRenewalJob)
                .launcher(jobLauncher)
                .build();
    }

    @Bean
    public Step dailyStockDataJobStep() {
        return new JobStepBuilder(new StepBuilder("dailyStockJobStep", jobRepository))
                .job(dailyStockJob)
                .launcher(jobLauncher)
                .build();
    }
}
