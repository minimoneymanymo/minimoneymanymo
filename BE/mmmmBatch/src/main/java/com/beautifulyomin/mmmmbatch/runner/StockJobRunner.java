package com.beautifulyomin.mmmmbatch.runner;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class StockJobRunner {

    private final JobLauncher jobLauncher;
    private final Job mainJob;

    @Autowired
    public StockJobRunner(JobLauncher jobLauncher, Job mainJob) {
        this.jobLauncher = jobLauncher;
        this.mainJob = mainJob;
    }

    @Scheduled(cron = "0 30 3 ? * MON-FRI")
    public void run() throws Exception {
        JobParameters params = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();
        jobLauncher.run(mainJob, params);
    }
}