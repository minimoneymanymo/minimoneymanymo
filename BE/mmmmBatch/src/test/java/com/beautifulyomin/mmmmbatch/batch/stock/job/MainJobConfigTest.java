package com.beautifulyomin.mmmmbatch.batch.stock.job;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.test.context.SpringBatchTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.assertThat;

@TestPropertySource(locations = "classpath:application-test.properties")
@SpringBatchTest
@ExtendWith(SpringExtension.class)
@SpringBootTest
class MainJobConfigTest {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job mainJob;

//    @BeforeAll
//    static void setUp() {  //모든 메서드 실행 전 딱 한 번
//        Dotenv dotenv = Dotenv.configure().load();
//        dotenv.entries().forEach(entry ->
//                System.setProperty(entry.getKey(), entry.getValue())
//        );
//    }

    @Test
    @DisplayName("MainJob이 각 JobStep을 올바르게 실행하는지 통합 테스트")
    void mainJobTest() throws Exception {
        JobParameters jobParameters  = new JobParameters();
        JobExecution jobExecution = jobLauncher.run(mainJob, jobParameters);
        System.out.println("⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐");
        System.out.println("Job Execution Status: " + jobExecution.getStatus());
        jobExecution.getStepExecutions().forEach(step -> {
            System.out.println("Step Name: " + step.getStepName());
            System.out.println("Step Status: " + step.getStatus());
            System.out.println("Step Exit Description: " + step.getExitStatus().getExitDescription());
        });
        assertThat(jobExecution.getStatus().isUnsuccessful()).isFalse();
        assertThat(jobExecution.getStepExecutions().stream()
                .anyMatch(step -> step.getStepName().equals("tokenRenewalJobStep")
                        && step.getStatus().isUnsuccessful()))
                .isFalse();
        assertThat(jobExecution.getStepExecutions().stream()
                .anyMatch(step -> step.getStepName().equals("dailyStockJobStep")
                        && step.getStatus().isUnsuccessful()))
                .isFalse();
    }
}