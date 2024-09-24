package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.fund.entity.StocksHeld;
import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;
import com.beautifulyomin.mmmm.domain.fund.repository.StocksHeldRepository;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import com.beautifulyomin.mmmm.domain.stock.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TradeServiceImpl implements TradeService {
    private final TradeRecordsRepository tradeRecordsRepository;
    private final StockRepository stockRepository;
    private final ChildrenRepository childrenRepository;
    private final StocksHeldRepository stocksHeldRepository;
    private final StockRepositoryCustom stockRepositoryCustom;

    @Override
    public void createTrade(TradeDto tradeDto, String userId) {
        // stock 정보 조회
        Stock stock = stockRepository.findById(tradeDto.getStockCode())
                .orElseThrow(() -> new IllegalArgumentException("Invalid stock code"));

        // userId로 아이 정보 조회해서 dto에 childrenId 설정하기
        Children children = childrenRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + userId));

        tradeDto.setChildrenId(children.getChildrenId());

        // stocksHeld 조회 시 매도 요청일 경우 존재하지 않으면 에러 발생
        StocksHeld stocksHeld = stocksHeldRepository.findByChildren_ChildrenIdAndStock_StockCode(children.getChildrenId(), stock.getStockCode())
                .orElse(null);

        if (stocksHeld == null && tradeDto.getTradeType().equals("5")) {
            // 매도 요청인데 stocksHeld가 없으면 에러 발생
            throw new IllegalArgumentException("Cannot sell stock that is not held.");
        }

        // stocksHeld가 없고 매수인 경우에만 새로운 StocksHeld 생성
        if (stocksHeld == null && tradeDto.getTradeType().equals("4")) {
            stocksHeld = StocksHeld.builder()
                    .children(children)
                    .stock(stock)
                    .build();
        }

        BigDecimal totalProfit = null;

        // 트랜잭션 타입에 따라 처리
        if (tradeDto.getTradeType().equals("4")) { // 매수
            // 매수 시 잔액 부족 여부 체크
            if (children.getMoney() < tradeDto.getAmount()) {
                throw new IllegalArgumentException("Insufficient funds for this purchase");
            }
            totalProfit = BigDecimal.ZERO;
            handleBuyTransaction(stocksHeld, tradeDto);
            children.setMoney(children.getMoney() - tradeDto.getAmount());
        } else if (tradeDto.getTradeType().equals("5")) { // 매도
            log.info("stocksHeld의 total_amount: {}", stocksHeld.getTotalAmount());
            log.info("stocksHeld의 remain_shares_count: {}",  stocksHeld.getRemainSharesCount());
            totalProfit = handleSellTransaction(stocksHeld, tradeDto);
            log.info("totalProfit = {}", totalProfit);
            children.setMoney(children.getMoney() + tradeDto.getAmount() + totalProfit.intValue());
        } else {
            throw new IllegalArgumentException("Invalid trade type");
        }

        // StocksHeld 저장
        stocksHeldRepository.save(stocksHeld);

        log.info("tradeRecord 생성 직전");
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

        log.info("tradeRecord 생성 완료");
        log.info("손익머니: {}", tradeRecord.getStockTradingGain());
        log.info("매매주수: {}", tradeRecord.getTradeSharesCount());
        // TradeRecord 저장
        tradeRecordsRepository.save(tradeRecord);
        log.info("tradeRecord 저장 했음");
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

        //평단가 계산
        /* 매도를 위해 평단 구하기. 금액 부분은 다 Integer로 변환
            - divide(): 나눗셈을 수행 시 반올림으로 소수점 처리
            - 이 코드에서는 소수점 셋째 자리에서 반올림, 둘째 자리까지만 출력
            - intValue(): BigDecimal 결과를 Integer로 변환. 소수점 이하가 있으면 자동으로 버림 */
        BigDecimal bigAveragePrice = BigDecimal.valueOf(stocksHeld.getTotalAmount()).divide(stocksHeld.getRemainSharesCount(), 2, RoundingMode.HALF_UP);
        log.info(" 평단가 : {} ", bigAveragePrice);

        // 매도 손익 계산 방법 : (현재가 − 평단가 ) × 매도 주식 수량
        BigDecimal closingPrice = stockRepositoryCustom.getDailyStockChart(tradeDto.getStockCode()).getClosingPrice();
        log.info(" closingPrice : {} ", closingPrice);
        BigDecimal profitPerShare = closingPrice.subtract(bigAveragePrice);
        log.info(" 현재가 − 평단가 : {} ", profitPerShare);
        // 손익 계산 후 소수점 둘째 자리로 반올림
        BigDecimal bigTotalProfit = profitPerShare.multiply(tradeDto.getTradeSharesCount()).setScale(2, RoundingMode.HALF_UP);
        log.info(" (현재가 − 평단가 ) × 매도 주식 수량 : {} ", bigTotalProfit);

        stocksHeld.setRemainSharesCount(stocksHeld.getRemainSharesCount().subtract(tradeDto.getTradeSharesCount())); // 보유주수
        stocksHeld.setTotalAmount(stocksHeld.getTotalAmount() - tradeDto.getAmount()); // 총합 빼기

        return bigTotalProfit;
    }
}

