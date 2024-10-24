package com.beautifulyomin.mmmmbatch.batch.stock.step.dailyStock;

import com.beautifulyomin.mmmmbatch.batch.stock.entity.DailyStockChart;
import com.beautifulyomin.mmmmbatch.batch.stock.entity.Stock52weekData;
import com.beautifulyomin.mmmmbatch.batch.stock.repository.DailyStockChartRepository;
import com.beautifulyomin.mmmmbatch.batch.stock.repository.Stock52WeekDataRepository;
import com.beautifulyomin.mmmmbatch.batch.stock.repository.DailyStockDataRepository;
import com.beautifulyomin.mmmmbatch.batch.stock.entity.DailyStockData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
public class DailyStockWriter implements ItemWriter<Map<String, Object>> {

    private final Stock52WeekDataRepository stock52WeekDataRepository;
    private final DailyStockDataRepository dailyStockDataRepository;
    private final DailyStockChartRepository dailyStockChartRepository;

    public DailyStockWriter(Stock52WeekDataRepository stock52WeekDataRepository, DailyStockDataRepository dailyStockDataRepository, DailyStockChartRepository dailyStockChartRepository) {
        this.stock52WeekDataRepository = stock52WeekDataRepository;
        this.dailyStockDataRepository = dailyStockDataRepository;
        this.dailyStockChartRepository = dailyStockChartRepository;
    }

    @Override
    public void write(Chunk<? extends Map<String, Object>> chunk) throws Exception {
//        log.info("⭐⭐⭐⭐⭐⭐⭐write 진입");
        for(Map<String, Object> item: chunk){
            DailyStockData dailyStockData = (DailyStockData) item.get("dailyStockData");
            Stock52weekData stock52weekData = (Stock52weekData) item.get("stock52weekData");
            DailyStockChart dailyStockChart = (DailyStockChart) item.get("dailyStockChart");
            dailyStockDataRepository.save(dailyStockData);
            stock52WeekDataRepository.save(stock52weekData);
            dailyStockChartRepository.save(dailyStockChart);
        }

    }
}
