package com.beautifulyomin.mmmm.constant;

import lombok.Getter;

@Getter
public enum RedisExpireTime {
    REPORT_CACHE_SEC(3600 * 24),
    STOCK_CACHE_SEC(3600),
    EMAIL_CACHE_SEC(60*5),
    ;

    private final int expireTime;

    RedisExpireTime(int expireTime) {
        this.expireTime = expireTime;
    }
}
