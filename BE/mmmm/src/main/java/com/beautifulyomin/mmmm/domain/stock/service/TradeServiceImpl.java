package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.fund.entity.StocksHeld;
import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;
import com.beautifulyomin.mmmm.domain.fund.repository.StocksHeldRepository;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.member.entity.ParentAndChildren;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentAndChildrenRepository;
import com.beautifulyomin.mmmm.domain.member.repository.ParentRepository;
import com.beautifulyomin.mmmm.domain.member.service.ParentService;
import com.beautifulyomin.mmmm.domain.stock.dto.ReasonBonusMoneyRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import com.beautifulyomin.mmmm.domain.stock.exception.TradeNotFoundException;
import com.beautifulyomin.mmmm.domain.stock.repository.*;
import com.beautifulyomin.mmmm.exception.InvalidRequestException;
import com.beautifulyomin.mmmm.exception.InvalidRoleException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.security.access.AccessDeniedException;
import java.util.Optional;

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
    private final ParentRepository parentRepository;
    private final ParentAndChildrenRepository parentAndChildrenRepository;
   // private final TradeRecordsRepositoryCustom tradeRecordsRepositoryCustom;
    private final ParentService parentService;

    @Override
    public void createTrade(TradeDto tradeDto, String userId) {
        // stock 정보 조회
        Stock stock = stockRepository.findById(tradeDto.getStockCode())
                .orElseThrow(() -> new IllegalArgumentException("주식코드가 유효하지 않습니다."));

        // userId로 아이 정보 조회해서 dto에 childrenId 설정하기
        Children children = childrenRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Children not found for userId: " + userId));

        tradeDto.setChildrenId(children.getChildrenId());

        if (tradeDto == null) {
            throw new IllegalArgumentException("TradeDto는 null일 수 없습니다.");
        }

        // stocksHeld 조회 시 매도 요청일 경우 존재하지 않으면 에러 발생
        StocksHeld stocksHeld = stocksHeldRepository.findByChildren_ChildrenIdAndStock_StockCode(children.getChildrenId(), stock.getStockCode())
                .orElse(null);

        if (stocksHeld == null && tradeDto.getTradeType().equals("5")) {
            // 매도 요청인데 stocksHeld가 없으면 에러 발생
            log.error("매도 주수 없음 에러");
            throw new IllegalArgumentException("매도할 수 있는 주식이 없습니다.");
        }

        // stocksHeld가 없고 매수인 경우에만 새로운 StocksHeld 생성
        if (stocksHeld == null && tradeDto.getTradeType().equals("4")) {
            stocksHeld = StocksHeld.builder()
                    .children(children)
                    .stock(stock)
                    .remainSharesCount(BigDecimal.ZERO) // 초기값 설정
                    .totalAmount(0) // 총합도 초기값 설정
                    .build();
        }

        BigDecimal totalProfit = null;

        // 트랜잭션 타입에 따라 처리
        if (tradeDto.getTradeType().equals("4")) { // 매수
            // 매수 시 잔액 부족 여부 체크
            if (children.getMoney() < tradeDto.getAmount()) {
                throw new IllegalArgumentException("매수하기에 머니가 부족합니다.");
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
            throw new IllegalArgumentException("매매 타입이 유효하지 않습니다.");
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
        if (stocksHeld.getRemainSharesCount() == null) {
            stocksHeld.setRemainSharesCount(BigDecimal.ZERO); // 초기화
        }
        stocksHeld.setRemainSharesCount(stocksHeld.getRemainSharesCount().add(tradeDto.getTradeSharesCount())); // 보유주수 더하기
        stocksHeld.setTotalAmount(stocksHeld.getTotalAmount() + tradeDto.getAmount()); // 총합 더하기
    }

    // 매도 처리
    private BigDecimal handleSellTransaction(StocksHeld stocksHeld, TradeDto tradeDto) {
        if (stocksHeld.getRemainSharesCount() == null) {
            throw new IllegalArgumentException("보유 주식 수량이 초기화되지 않았습니다.");
        }

        if (stocksHeld.getRemainSharesCount().compareTo(tradeDto.getTradeSharesCount()) < 0) {
            log.debug("Not enough shares to sell");
            throw new IllegalArgumentException("매도하려는 주식 수가 보유하고 있는 주식 수보다 많습니다.");
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

    @Override
    public int updateReaseonBonusMoney(String parentUserId, ReasonBonusMoneyRequestDto requestDto) {

        //이유 보상 머니 줄 수 없는 경우
        //없는관계인 경우
        Parent parent = parentRepository.findByUserId(parentUserId)
                .orElseThrow(() -> new InvalidRoleException("부모가 아닙니다."));
        Children child = childrenRepository.findByUserId(requestDto.getChildrenUserId())
                .orElseThrow(() -> new InvalidRoleException("이 유저아이디의 자녀 찾을 수 없음 : " + requestDto.getChildrenUserId()));


        Integer parentId = parent.getParentId();
        Integer childrenId = child.getChildrenId();
        Optional<ParentAndChildren> parentAndChildrenTrue = parentAndChildrenRepository.findByParent_ParentIdAndChild_ChildrenIdAndIsApprovedTrue(parentId, childrenId);

        // 없는 관계인 경우 에러
        if(parentAndChildrenTrue.isEmpty()){
           throw new InvalidRoleException("부모자식관계가 아닙니다.");
        }

        //부모의 계좌 잔액이 부족
        if(parent.getBalance() < requestDto.getReasonBonusMoney()){
            throw new InvalidRequestException("이유 보상 금액이 마니모 계좌 잔액보다 큽니다.");
        }


        //거래내역을 찾을 수 없는 경우
        Optional<TradeDto> trade =  tradeRecordsRepository.findTredeByCreateAt(requestDto.getCreatedAt());
        if(trade.isEmpty()){
            throw new TradeNotFoundException(requestDto.getCreatedAt());
        }
       //해당 자식의 거래내역이 아닌경우
        if(!trade.get().getChildrenId().equals(child.getChildrenId())) {
            throw new AccessDeniedException("해당 거래는 요청한 사용자의 것이 아닙니다.");
        }
        //이미 이유보상머니를 지급한 경우
        else if(trade.get().getReasonBonusMoney() != null){
            throw new InvalidRequestException("이미 이유 보상 머니를 지급했습니다.");
        }
        long result = tradeRecordsRepository.UpdateReasonBonusMoneyByCreateAt(parentUserId,child.getChildrenId(),requestDto.getReasonBonusMoney() ,requestDto.getCreatedAt());
        //성공적으로 반환한경우 result = 1


        return (int) result;
    }

}

