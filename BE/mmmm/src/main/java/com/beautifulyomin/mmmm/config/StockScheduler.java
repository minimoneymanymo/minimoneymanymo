package com.beautifulyomin.mmmm.config;

import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

@Component
public class StockScheduler {
    private final CacheManager cacheManager;

    public StockScheduler(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }
}
