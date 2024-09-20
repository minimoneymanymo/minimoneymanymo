package com.beautifulyomin.mmmm.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class StockScheduler {
    private final CacheManager cacheManager;

    @Autowired
    public StockScheduler(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @Scheduled(cron = "0 23 14 ? * MON-FRI")
    public void clearCache() {
        cacheManager.getCacheNames().forEach(cacheName -> {
            cacheManager.getCache(cacheName).clear();
        });
        log.info("Redis 캐시가 초기화 되었습니다.");
    }
}
