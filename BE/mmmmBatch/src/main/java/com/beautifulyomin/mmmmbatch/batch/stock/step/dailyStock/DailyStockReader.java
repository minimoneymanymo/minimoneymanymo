package com.beautifulyomin.mmmmbatch.batch.stock.step.dailyStock;

import com.beautifulyomin.mmmmbatch.batch.stock.entity.Stock;
import com.beautifulyomin.mmmmbatch.batch.stock.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.annotation.BeforeStep;
import org.springframework.batch.item.ItemReader;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class DailyStockReader implements ItemReader<String> {
    private final StockRepository stockRepository;
    private Iterator<Stock> stockIterator;

    @BeforeStep
    public void beforeStep() {
        Sort sort = Sort.by(Sort.Direction.ASC, "stockCode");
        stockIterator = stockRepository.findAll(sort).iterator();
    }

    @Override
    public String read() {
        log.info("⭐⭐⭐read");
        if (stockIterator.hasNext()) {
            return stockIterator.next().getStockCode();
        }
        return null;
    }

}
