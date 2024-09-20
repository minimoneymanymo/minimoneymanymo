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
import java.math.RoundingMode;

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
        Stock stock = stockRepository.findById(tradeDto.getStockCode())
                .orElseThrow(() -> new IllegalArgumentException("Invalid stock code"));
        // 아이 정보 조회
        Children children = childrenRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + userId));

        tradeDto.setChildrenId(children.getChildrenId());

        // stocksHeld가 없는 경우 -> 신규 생성 -> 이 때는 무조건 "매수"일 것임, 만일 아무 것도 없는데 매도라면 에러 발생
        // 여기서 tradeType 보고 바로 에러 발생 시키려 했는데, 잔액 보고 결정해도 될 것 같아서 아래에서 발생시킬 예정.
        StocksHeld stocksHeld = stocksHeldRepository.findByChildren_ChildrenIdAndStock_StockCode(children.getChildrenId(), stock.getStockCode())
                .orElseGet(() -> StocksHeld.builder()
                        .children(children)
                        .stock(stock)
                        .remainSharesCount(tradeDto.getTradeSharesCount()) // 보유주수
                        .totalAmount(tradeDto.getAmount()) // 가격총합
                        .build());

        BigDecimal totalProfit = null;

        // 트랜잭션 타입에 따라 처리
        if (tradeDto.getTradeType().equals("4")) { // 매수
            // 매수 시 잔액 부족 여부 체크
            if (children.getMoney() < tradeDto.getAmount()) {
                throw new IllegalArgumentException("Insufficient funds for this purchase");
            }
            handleBuyTransaction(stocksHeld, tradeDto);
            children.setMoney(children.getMoney() - tradeDto.getAmount());
        } else if (tradeDto.getTradeType().equals("5")) { // 매도
            totalProfit = handleSellTransaction(stocksHeld, tradeDto);
            Integer totalProfitAsInt = totalProfit.intValue();
            children.setMoney(children.getMoney() + tradeDto.getAmount() + totalProfitAsInt);
        } else {
            throw new IllegalArgumentException("Invalid trade type");
        }

        // StocksHeld 저장
        stocksHeldRepository.save(stocksHeld);

        // TradeRecord 엔티티 빌더 패턴 사용하여 생성
        TradeRecord tradeRecord = TradeRecord.builder()
                .stock(stock)
                .children(children)
                .amount(tradeDto.getAmount())
                .stockTradingGain(totalProfit) // 손익머니 - 매도 시에만 사용, BigDecimal
                .tradeType(tradeDto.getTradeType())
                .reason(tradeDto.getReason())
                .tradeSharesCount(tradeDto.getTradeSharesCount()) // 매매 주수
                .remainAmount(children.getMoney())
                .build();

        // TradeRecord 저장
        tradeRepository.save(tradeRecord);
    }

    // 매수 처리
    private void handleBuyTransaction(StocksHeld stocksHeld, TradeDto tradeDto) {
        stocksHeld.setRemainSharesCount(stocksHeld.getRemainSharesCount().add(tradeDto.getTradeSharesCount())); // 보유주수 더하기
        stocksHeld.setTotalAmount(stocksHeld.getTotalAmount() + tradeDto.getAmount()); // 총합 더하기
    }

    // 매도 처리
    private BigDecimal handleSellTransaction(StocksHeld stocksHeld, TradeDto tradeDto) {
        if (stocksHeld.getRemainSharesCount().compareTo(tradeDto.getTradeSharesCount()) < 0) {
            throw new IllegalArgumentException("Not enough shares to sell");
        }

        /* 매도를 위해 평단 구하기. 금액 부분은 다 Integer로 변환
            - divide(): 나눗셈을 수행 시 반올림으로 소수점 처리
            - 이 코드에서는 소수점 셋째 자리에서 반올림, 둘째 자리까지만 출력
            - intValue(): BigDecimal 결과를 Integer로 변환. 소수점 이하가 있으면 자동으로 버림 */
        BigDecimal bigAveragePrice = BigDecimal.valueOf(stocksHeld.getTotalAmount()).divide(stocksHeld.getRemainSharesCount(), 2, RoundingMode.HALF_UP);

        // 매도 손익 계산 방법 : (현재가 − 평단가 ) × 매도 주식 수량
        BigDecimal closingPrice = dailyStockChartRepository.findLatestClosingPriceByStockCode(tradeDto.getStockCode());
        BigDecimal profitPerShare = closingPrice.subtract(bigAveragePrice);
        BigDecimal bigTotalProfit = profitPerShare.multiply(tradeDto.getTradeSharesCount());

        stocksHeld.setRemainSharesCount(stocksHeld.getRemainSharesCount().subtract(tradeDto.getTradeSharesCount())); // 보유주수
        stocksHeld.setTotalAmount(stocksHeld.getTotalAmount() - tradeDto.getAmount()); // 총합 빼기

        return bigTotalProfit;
    }
}

