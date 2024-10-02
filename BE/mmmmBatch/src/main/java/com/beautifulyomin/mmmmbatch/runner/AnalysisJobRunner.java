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
    private final Job investorClusteringJob;

    @Scheduled(cron = "0 10 17 ? * MON-FRI")
    public void run() throws Exception {
        JobParameters params = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis()) // JobParameters에 현재 시간 추가
                .toJobParameters();
        jobLauncher.run(investmentAnalysisJob, params); // 잡 실행
    }

//    @Override
//    public void run(String... args) throws Exception {
//        JobParameters params = new JobParametersBuilder()
//                .addLong("time", System.currentTimeMillis())
//                .toJobParameters();
//        jobLauncher.run(investmentAnalysisJob, params);
//    }

//    @Override
//    public void run(String... args) throws Exception {
//        JobParameters params = new JobParametersBuilder()
//                .addLong("time", System.currentTimeMillis())
//                .toJobParameters();
//        jobLauncher.run(investorClusteringJob, params);
//    }


}
