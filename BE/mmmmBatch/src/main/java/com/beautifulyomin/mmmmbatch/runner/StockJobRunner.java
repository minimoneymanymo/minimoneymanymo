package com.beautifulyomin.mmmmbatch.runner;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class StockJobRunner {  //implements CommandLineRunner

    private final JobLauncher jobLauncher;
    private final Job mainJob;

    @Autowired
    public StockJobRunner(JobLauncher jobLauncher, @Qualifier("mainJob") Job mainJob) {
        this.jobLauncher = jobLauncher;
        this.mainJob = mainJob;
    }

//    @Override
//    public void run(String... args) throws Exception {
//        JobParameters params = new JobParametersBuilder()
//                .addLong("time", System.currentTimeMillis())
//                .toJobParameters();
//        jobLauncher.run(mainJob, params);
//    }

    @Scheduled(cron = "0 30 15 ? * MON-FRI")
    public void run() throws Exception {
        JobParameters params = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();
        jobLauncher.run(mainJob, params);
    }


}