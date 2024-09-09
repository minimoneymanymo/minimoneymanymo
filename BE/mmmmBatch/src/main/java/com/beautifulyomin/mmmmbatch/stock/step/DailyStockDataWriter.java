package com.beautifulyomin.mmmmbatch.stock.step;

import com.beautifulyomin.mmmmbatch.stock.entity.DailyStockData;
import com.beautifulyomin.mmmmbatch.stock.repository.StockDataRepository;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DailyStockDataWriter implements ItemWriter<DailyStockData> {

    private final StockDataRepository stockDataRepository;

    public DailyStockDataWriter(StockDataRepository stockDataRepository) {
        this.stockDataRepository = stockDataRepository;
    }

    @Override
    public void write(Chunk<? extends DailyStockData> chunk) throws Exception {
        stockDataRepository.saveAll(chunk.getItems());
    }
}
