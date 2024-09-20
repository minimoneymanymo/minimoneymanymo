package com.beautifulyomin.mmmm.domain.stock.service;

import com.beautifulyomin.mmmm.domain.fund.entity.StocksHeld;
import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;
import com.beautifulyomin.mmmm.domain.fund.repository.StocksHeldRepository;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.entity.DailyStockChart;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import com.beautifulyomin.mmmm.domain.stock.repository.DailyStockChartRepository;
import com.beautifulyomin.mmmm.domain.stock.repository.StockRepository;
import com.beautifulyomin.mmmm.domain.stock.repository.TradeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TradeServiceImplTest {
    @Mock
    private TradeRepository tradeRepository; // 거래 관련 repository
    @Mock
    private StockRepository stockRepository;
    @Mock
    private ChildrenRepository childrenRepository;
    @Mock
    private StocksHeldRepository stocksHeldRepository;
    @Mock
    private DailyStockChartRepository dailyStockChartRepository;

    @InjectMocks
    private TradeServiceImpl tradeServiceImpl;

    static Stock stock;
    static Children children;
    static StocksHeld stocksHeld;
    static DailyStockChart dailyStockChart;
    static TradeDto tradeDto;

    @BeforeEach
    void setUp() {
        tradeDto = TradeDto.builder()
                .stockCode("462870")
                .amount(10000)
                .tradeSharesCount(new BigDecimal("10.0"))
                .reason("시총이 높아서 샀어요.")
                .tradeType("4") // 매수
                .remainAmount(30000)
                .build();


        stock = new Stock(
                "462870",                    // stockCode
                "테스트종목",                  // companyName
                "테스트 산업",                // industry
                "테스트 제품",                // mainProducts
                new Date(),                   // listingDate
                12,                           // settlementMonth
                "테스트 CEO",                 // ceoName
                "https://www.testcompany.com", // website
                "서울",                        // region
                "KOSPI",                      // marketName
                "5000",                       // faceValue
                "KRW"                         // currencyName
        );

        dailyStockChart = DailyStockChart.builder()
                .stockCode("462870")
                .date(LocalDate.of(2024, 9, 11))
                .operatingPrice(BigDecimal.valueOf(56900.00))
                .highestPrice(BigDecimal.valueOf(61300.00))
                .lowestPrice(BigDecimal.valueOf(56300.00))
                .closingPrice(BigDecimal.valueOf(60600.00))
                .tradingVolume(BigInteger.valueOf(234643))
                .build();

        children = Children.builder()
                .userId("1111")
                .money(300000)
                .build();

        stocksHeld = StocksHeld.builder()
                .children(children)
                .stock(stock)
                .remainSharesCount(BigDecimal.valueOf(5.00))
                .totalAmount(30000)
                .build();


    }

    @Test
    @DisplayName("주식 보유 내역의 보유 주수, children 가격 총합, stockHeld 잔액이 잘 바뀌는지 테스트")
    void stocksHeldUpdateAfterTrade() {
        // Mock 설정
        when(stockRepository.findById("462870")).thenReturn(Optional.of(stock));
        when(childrenRepository.findByUserId("1111")).thenReturn(Optional.of(children));
        when(stocksHeldRepository.findByChildren_ChildrenIdAndStock_StockCode(any(), any())).thenReturn(Optional.of(stocksHeld));

        // when
        tradeServiceImpl.createTrade(tradeDto, "1111");

        // then -> 매수
        assertEquals(new BigDecimal("15.0"), stocksHeld.getRemainSharesCount());
        assertEquals(290000, children.getMoney()); // childrend 머니 잔액이 10000 감소했는지 확인
        assertEquals(40000, stocksHeld.getTotalAmount()); // stocksHeld 잔액이 10000 증가했는지 확인
    }

    @Test
    @DisplayName("매수 매도 거래 내역에서 남은 머니가 잘 바뀌는지 테스트")
    void moneyChangeAfterTrade(){

    }

    // 입출금 내역에서 남은 머니가 잘 변경되는지 테스트 -> 이건 입출금할 때
    // 소수점 단위로 연산하기 때문에 소수점과 금액이 잘 반영되서 연산되는지 테스트 -> 이거는 프론트 처리
}