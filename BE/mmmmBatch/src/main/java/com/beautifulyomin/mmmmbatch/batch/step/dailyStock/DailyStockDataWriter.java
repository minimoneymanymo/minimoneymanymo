package com.beautifulyomin.mmmmbatch.batch.step.dailyStock;

import com.beautifulyomin.mmmmbatch.batch.entity.Stock52weekData;
import com.beautifulyomin.mmmmbatch.batch.repository.Stock52WeekDataRepository;
import com.beautifulyomin.mmmmbatch.batch.repository.StockDataRepository;
import com.beautifulyomin.mmmmbatch.batch.entity.DailyStockData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
public class DailyStockDataWriter implements ItemWriter<Map<String, Object>> {

    private final Stock52WeekDataRepository stock52WeekDataRepository;
    private final StockDataRepository stockDataRepository;

    public DailyStockDataWriter(Stock52WeekDataRepository stock52WeekDataRepository, StockDataRepository stockDataRepository) {
        this.stock52WeekDataRepository = stock52WeekDataRepository;
        this.stockDataRepository = stockDataRepository;
    }

    @Override
    public void write(Chunk<? extends Map<String, Object>> chunk) throws Exception {
//        log.info("⭐⭐⭐⭐⭐⭐⭐write 진입");
        for(Map<String, Object> item: chunk){
            DailyStockData dailyStockData = (DailyStockData) item.get("dailyStockData");
            Stock52weekData stock52weekData = (Stock52weekData) item.get("stock52weekData");
            stockDataRepository.save(dailyStockData);
            stock52WeekDataRepository.save(stock52weekData);
        }

    }
}
