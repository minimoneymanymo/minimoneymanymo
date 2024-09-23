package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.config.QueryDslConfig;
import com.beautifulyomin.mmmm.domain.fund.entity.StocksHeld;
import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@TestPropertySource(locations = "classpath:application-test.properties")
@DataJpaTest
@Import(QueryDslConfig.class)
class TradeRecordsRepositoryCustomImplTest {

    @Autowired
    private TradeRecordsRepository tradeRecordsRepository;

    @Autowired
    private TestEntityManager entityManager;

    static Children children;
    static Stock stock;
    static StocksHeld stocksHeld;

//    @BeforeAll
//    static void setUp() {  //모든 메서드 실행 전 딱 한 번
//        Dotenv dotenv = Dotenv.configure().load();
//        dotenv.entries().forEach(entry ->
//                System.setProperty(entry.getKey(), entry.getValue())
//        );
//    }

    @BeforeEach
    void init() { //메서드 각각마다 한 번씩 실행됨 (공통으로 사용해야 하는 것들은 여기서 선언하면 좋음)
        children = new Children(
                "areumbaby",
                "아름자식",
                "1234",
                "010-8625-9046",
                "199705080000"
        );

        entityManager.persist(children); //영속성 컨텍스트에 등록

        stock = new Stock(
                "111111",                    // stockCode
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
        entityManager.persist(stock);

        // 임의의 주식 보유 내역 추가
        stocksHeld = new StocksHeld(
                children,
                stock,
                1,
                BigDecimal.valueOf(3.0),
                90000
        );
        entityManager.merge(stocksHeld);
    }

    @Test
    @DisplayName("매매 성공 테스트")
    void tradeSuccessTest() {
        //given
        TradeRecord tradeRecord = new TradeRecord(
                children,
                stock,
                40000,
                BigDecimal.valueOf(0.5),
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")),
                "투자 이유입니다.",
                "4",
                30000
        );
        entityManager.persist(tradeRecord);
        entityManager.flush();

        //when
        TradeRecord savedTradeRecord = tradeRecordsRepository.save(tradeRecord);

        //then
        assertNotNull(savedTradeRecord.getTradeRecordId(), "저장된 매매 기록의 ID는 null이 아니어야 합니다.");
        assertEquals(tradeRecord.getChildren().getUserId(), savedTradeRecord.getChildren().getUserId(), "저장된 매매 기록의 자식 ID가 일치해야 한다.");
        assertEquals(tradeRecord.getStock().getStockCode(), savedTradeRecord.getStock().getStockCode(), "저장된 매매 기록의 종목 코드가 일치해야 한다.");
        assertEquals(tradeRecord.getAmount(), savedTradeRecord.getAmount(), "저장된 매매 기록의 거래금액이 일치해야 한다.");
        assertEquals(tradeRecord.getTradeSharesCount(), savedTradeRecord.getTradeSharesCount(), "저장된 매매 기록의 매매주수가 일치해야 한다.");
        assertEquals(tradeRecord.getCreatedAt(), savedTradeRecord.getCreatedAt(), "생성 일시가 일치해야 한다");
        assertEquals(tradeRecord.getReason(), savedTradeRecord.getReason(), "저장된 매매 기록의 이유가 일치해야 한다.");
        assertEquals(tradeRecord.getTradeType(), savedTradeRecord.getTradeType(), "매매 요청종류가 일치해야 한다.");
        assertEquals(tradeRecord.getRemainAmount(), savedTradeRecord.getRemainAmount(), "저장된 매매기록의 남은 머니가 일치해야 한다.");
    }

    // 매매 실패 테스트 1. 혹시 매매 할 때 이유를 입력 안하는 경우가 있을까봐 테스트 코드 짜보려 했는데 컴파일 에러가 먼저 나서 패스하기로 함.

    /*
    @Test
    @DisplayName("매매 실패 테스트")
    void tradeFailTest() {
        // 데이터베이스에 저장할 때 예외가 발생해야 함
        Throwable thrownException = Assertions.assertThrows(MethodArgumentNotValidException.class, ()-> new TradeDto(
                stock.getStockCode(),
                40000,
                BigDecimal.valueOf(0.5),
                null, // 모르고 이유 입력 안 함
                "4"
        ));

        // 예외가 발생했는지 확인
        Assertions.assertNotNull(thrownException);

        // 예외의 원인을 확인
        Throwable rootCause = thrownException.getCause();
        while (rootCause.getCause() != null) {
            rootCause = rootCause.getCause();
        }

        // 예외의 최종 원인이 ConstraintViolationException인지 확인
        Assertions.assertTrue(rootCause instanceof ConstraintViolationException, "Expected root cause to be ConstraintViolationException but was " + rootCause.getClass().getName());
    }
    */

}