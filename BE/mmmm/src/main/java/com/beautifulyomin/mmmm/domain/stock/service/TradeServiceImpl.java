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

@Service
@RequiredArgsConstructor
public class TradeServiceImpl implements TradeService {
    private final TradeRepository tradeRepository;
    private final StockRepository stockRepository;
    private final ChildrenRepository childrenRepository;

    @Override
    public void createTrade(TradeDto tradeDto, String userId) {
        // stock 정보 조회
        Stock stock = stockRepository.findByStockCode(tradeDto.getStockCode());
        // 아이 정보 조회
        Children children = childrenRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + tradeDto.getChildrenId()));

        tradeDto.setChildrenId(children.getChildrenId());

        // TradeRecord 엔티티 빌더 패턴 사용하여 생성
        TradeRecord tradeRecord = TradeRecord.builder()
                .children(children)
                .stock(stock)
                .amount(tradeDto.getAmount())
                .tradeSharesCount(tradeDto.getTradeSharesCount())
                .reason(tradeDto.getReason())
                .tradeType(tradeDto.getTradeType())
                .remainAmount(tradeDto.getRemainAmount())
                .build();

        // TradeRecord 저장
        tradeRepository.save(tradeRecord);
    }
}
