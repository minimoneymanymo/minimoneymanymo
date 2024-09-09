package com.beautifulyomin.mmmmbatch.stock.step;

import org.springframework.batch.item.ItemReader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DailyStockDataReader implements ItemReader<String> {
    private final JdbcTemplate jdbcTemplate;
    private List<String> stockCodes;
    private int nextIndex;

    public DailyStockDataReader(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.nextIndex = 0;
    }

    @Override
    public String read() {
        if (stockCodes == null) {
            stockCodes = jdbcTemplate.queryForList("select stock_code from stocks order by stock_code", String.class);
        }
        if (nextIndex < stockCodes.size()) {
            return stockCodes.get(nextIndex++);
        }
        nextIndex = 0;
        return null;
    }
}
