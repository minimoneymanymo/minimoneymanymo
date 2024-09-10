package com.beautifulyomin.mmmmbatch.runner;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class JobRunner {

    private final JobLauncher jobLauncher;
    private final Job importDailyStockDataJob;

    @Autowired
    public JobRunner(JobLauncher jobLauncher, Job importDailyStockDataJob) {
        this.jobLauncher = jobLauncher;
        this.importDailyStockDataJob = importDailyStockDataJob;
    }

    @Scheduled(cron = "0 55 21 * * ?")
    public void run() throws Exception {
        // Job 파라미터 설정 (중복 실행을 위해 매번 다른 값 추가)
        JobParameters params = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();
        jobLauncher.run(importDailyStockDataJob, params);
    }
}