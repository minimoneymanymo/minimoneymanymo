package com.beautifulyomin.mmmmbatch.batch.stock.step.dailyStock;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemReader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.*;

@Slf4j
@Component
public class DailyStockReader implements ItemReader<String> {
    private final JdbcTemplate jdbcTemplate;
    private List<String> stockCodes;
    private int nextIndex;

    public DailyStockReader(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.nextIndex = 0;
    }

    @Override
    public String read() {
//        log.info("⭐⭐⭐⭐⭐⭐⭐read 진입");
        if (stockCodes == null) {
            stockCodes = jdbcTemplate.queryForList("select stock_code " +
                    "from stocks " +
                    "order by stock_code", String.class);
        }
        if (nextIndex < stockCodes.size()) {
            return stockCodes.get(nextIndex++);
        }
        nextIndex = 0;
        return null;
    }
}
