package com.beautifulyomin.mmmm.domain.fund.service;

import com.beautifulyomin.mmmm.domain.fund.dto.StockHeldDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockHeldServiceImpl implements StockHeldService {

    @Override
    public List<StockHeldDto> findAllStocksHeldById(String childrenId) {
        return List.of();
    }

    @Override
    public StockHeldDto findStockHeldById(String childrenId) {
        return null;
    }
}
