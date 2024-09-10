package com.beautifulyomin.mmmmbatch.batch.stock.step;

import com.beautifulyomin.mmmmbatch.batch.stock.entity.DailyStockData;
import com.beautifulyomin.mmmmbatch.batch.stock.repository.StockDataRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class DailyStockDataWriter implements ItemWriter<DailyStockData> {

    private final StockDataRepository stockDataRepository;

    public DailyStockDataWriter(StockDataRepository stockDataRepository) {
        this.stockDataRepository = stockDataRepository;
    }

    @Override
    public void write(Chunk<? extends DailyStockData> chunk) throws Exception {
//        log.info("⭐⭐⭐⭐⭐⭐⭐write 진입");
        System.out.println(chunk.getItems());
        stockDataRepository.saveAll(chunk.getItems());
    }
}
