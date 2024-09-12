package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import com.beautifulyomin.mmmm.domain.stock.repository.StockRepository;
import com.beautifulyomin.mmmm.domain.stock.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TradeServiceImpl implements TradeService {
    private final TradeRepository tradeRepository;
    private final StockRepository stockRepository;
    private final ChildrenRepository childrenRepository;

    @Override
    public void createTrade(TradeDto tradeDto) {
        // stock 정보 조회
        Stock stock = stockRepository.findByStockCode(tradeDto.getStockCode());
        // 아이 정보 조회
        Children children = childrenRepository.findByUserId(String.valueOf(tradeDto.getChildrenId()))
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + tradeDto.getChildrenId()));

        tradeDto.setChildrenId(children.getChildrenId());

        // TradeRecord 엔티티 생성 및 설정
        TradeRecord tradeRecord = new TradeRecord();

        tradeRecord.setChildren(children);
        tradeRecord.setStock(stock);

        tradeRecord.setAmount(tradeDto.getAmount());
        tradeRecord.setTradeSharesCount(tradeDto.getTradeSharesCount());
        tradeRecord.setReason(tradeDto.getReason());
        tradeRecord.setTradeType(tradeDto.getTradeType());
        tradeRecord.setRemainAmount(tradeDto.getRemainAmount());

        // TradeRecord 저장
        tradeRepository.save(tradeRecord);
    }
}
