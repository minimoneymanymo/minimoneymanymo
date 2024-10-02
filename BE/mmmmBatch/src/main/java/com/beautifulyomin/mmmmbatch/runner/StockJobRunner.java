package com.beautifulyomin.mmmmbatch.runner;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class StockJobRunner {

    private final JobLauncher jobLauncher;
    private final Job mainJob;

    @Autowired
    public StockJobRunner(JobLauncher jobLauncher, @Qualifier("mainJob") Job mainJob) {
        this.jobLauncher = jobLauncher;
        this.mainJob = mainJob;
    }

        @Scheduled(cron = "0 05 16 ? * MON-FRI")
//    @Scheduled(cron = "0 39 20 ? * *")
    public void run() throws Exception {
        JobParameters params = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();
        jobLauncher.run(mainJob, params);
    }

}