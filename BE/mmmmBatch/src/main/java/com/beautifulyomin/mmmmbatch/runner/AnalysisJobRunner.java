package com.beautifulyomin.mmmmbatch.runner;

import lombok.AllArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class AnalysisJobRunner { //implements CommandLineRunner
    private final JobLauncher jobLauncher;
    private final Job investmentAnalysisJob;

    @Scheduled(cron = "0 00 16 L * ?") //매달 마지말날
    public void run() throws Exception {
        JobParameters params = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();
        jobLauncher.run(investmentAnalysisJob, params);
    }

//    @Override
//    public void run(String... args) throws Exception {
//        JobParameters params = new JobParametersBuilder()
//                .addLong("time", System.currentTimeMillis())
//                .toJobParameters();
//        jobLauncher.run(investmentAnalysisJob, params);
//    }

}
