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
public class QuizJobRunner  implements CommandLineRunner{ //
    private final JobLauncher jobLauncher;
    private final Job newsQuizJob;

    @Autowired
    public QuizJobRunner(JobLauncher jobLauncher, @Qualifier("newsQuizJob") Job newsQuizJob) {
        this.jobLauncher = jobLauncher;
        this.newsQuizJob = newsQuizJob;

    }

//    @Scheduled(cron = "0 43 12 ? * MON-FRI")
//    public void run() throws Exception {
//        JobParameters params = new JobParametersBuilder()
//                .addLong("time", System.currentTimeMillis()) // JobParameters에 현재 시간 추가
//                .toJobParameters();
//        jobLauncher.run(newsQuizJob, params); // 잡 실행
//    }

    @Override
    public void run(String... args) throws Exception {
//        JobParameters params = new JobParametersBuilder()
//                .addLong("time", System.currentTimeMillis())
//                .toJobParameters();
//        jobLauncher.run(newsQuizJob, params); // 애플리케이션 시작 시 배치 작업 실행
    }
}
