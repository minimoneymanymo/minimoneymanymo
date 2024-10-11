package com.beautifulyomin.mmmmbatch.listner;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class JobDurationListener implements JobExecutionListener {
    private long startTime;

    @Override
    public void beforeJob(JobExecution jobExecution) {
        startTime = System.currentTimeMillis();
        log.info("⭐⭐⭐⭐⭐시작 시간::" + startTime);
    }

    @Override
    public void afterJob(JobExecution jobExecution) {
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        log.info("⭐⭐⭐⭐⭐종료 시간::" + endTime);
        log.info("🚩🚩🚩🚩🚩전체 소요 시간::" + duration + " ms (" + duration / 1000 + " seconds");
    }
}
