package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.fund.entity.StocksHeld;
import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;
import com.beautifulyomin.mmmm.domain.fund.repository.StocksHeldRepository;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import com.beautifulyomin.mmmm.domain.stock.repository.DailyStockChartRepository;
import com.beautifulyomin.mmmm.domain.stock.repository.StockRepository;
import com.beautifulyomin.mmmm.domain.stock.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class TradeServiceImpl implements TradeService {
    private final TradeRepository tradeRepository;
    private final StockRepository stockRepository;
    private final ChildrenRepository childrenRepository;
    private final StocksHeldRepository stocksHeldRepository;
    private final DailyStockChartRepository dailyStockChartRepository;

    @Override
    public void createTrade(TradeDto tradeDto, String userId) {
        // stock 정보 조회
        Stock stock = stockRepository.findByStockCode(tradeDto.getStockCode())
                .orElseThrow(() -> new IllegalArgumentException("Invalid stock code"));
        // 아이 정보 조회
        Children children = childrenRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + userId));

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

        // StocksHeld 엔티티 조회 또는 새로 생성
        // 종가. 즉, 우리 서비스 상의 현재가 가져오기
        BigDecimal closingPrice = dailyStockChartRepository.findClosingPriceByStockCode(tradeDto.getStockCode());
        BigDecimal bigTotalAmount = tradeDto.getTradeSharesCount().multiply(closingPrice);
        // totalAmount 가 Integer라 강제 형변환, 소수점 이하 버림
        Integer intTotalAmount = bigTotalAmount.intValue();


        // stocksHeld가 없는 경우 -> 신규 생성 -> 이 때는 무조건 매수일 것임, 만일 아무 것도 없는데 매도라면 에러 발생
        // 여기서 tradeType 보고 바로 에러 발생 시키려 했는데, 잔액 보고 결정해도 될 것 같아서 아래에서 발생시킬 예정.
        StocksHeld stocksHeld = stocksHeldRepository.findByChildrenIdAndStockCode(children.getChildrenId(), stock.getStockCode())
                .orElseGet(() -> StocksHeld.builder()
                        .children(children)
                        .stock(stock)
                        .remainSharesCount(tradeDto.getTradeSharesCount())
                        .totalAmount(intTotalAmount)
                        .build());

        // 트랜잭션 타입에 따라 처리
        if (tradeDto.getTradeType().equals("4")) { // 매수
            handleBuyTransaction(stocksHeld, tradeDto);
        } else if (tradeDto.getTradeType().equals("5")) { // 매도
            handleSellTransaction(stocksHeld, tradeDto);
        } else {
            throw new IllegalArgumentException("Invalid trade type");
        }

        stocksHeldRepository.save(stocksHeld);
    }

    // 매수 처리
    private void handleBuyTransaction(StocksHeld stocksHeld, TradeDto tradeDto) {
        stocksHeld.setRemainSharesCount(stocksHeld.getRemainSharesCount().add(tradeDto.getTradeSharesCount()));
        stocksHeld.setTotalAmount(stocksHeld.getTotalAmount() + tradeDto.getAmount());
    }

    // 매도 처리
    private void handleSellTransaction(StocksHeld stocksHeld, TradeDto tradeDto) {
        if (stocksHeld.getRemainSharesCount().compareTo(tradeDto.getTradeSharesCount()) < 0) {
            throw new IllegalArgumentException("Not enough shares to sell");
        }

        /* 매도를 위해 평단 구하기. 금액 부분은 다 Integer로 변환
            - divide(): 나눗셈을 수행 시 반올림으로 소수점 처리
            - intValue(): BigDecimal 결과를 Integer로 변환. 소수점 이하가 있으면 자동으로 버림 */
        BigDecimal bigAveragePrice = BigDecimal.valueOf(stocksHeld.getTotalAmount()).divide(stocksHeld.getRemainSharesCount());
        Integer averagePrice = bigAveragePrice.intValue();

        stocksHeld.setRemainSharesCount(stocksHeld.getRemainSharesCount().subtract(tradeDto.getTradeSharesCount()));

        // totalAmount 갱신 하는 것 추가.
    }
}

