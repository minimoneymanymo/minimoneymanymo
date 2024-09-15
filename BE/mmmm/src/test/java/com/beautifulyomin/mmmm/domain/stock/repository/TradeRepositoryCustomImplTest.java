package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.config.QueryDslConfig;
import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.TransactionSystemException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Import(QueryDslConfig.class)
class TradeRepositoryCustomImplTest {

    @Autowired
    private TradeRepository tradeRepository;

    @Autowired
    private TestEntityManager entityManager;

    static Children children;
    static Stock stock;

    @BeforeAll
    static void setUp() {  //모든 메서드 실행 전 딱 한 번
        Dotenv dotenv = Dotenv.configure().load();
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );
    }

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
        TradeRecord savedTradeRecord = tradeRepository.save(tradeRecord);

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

    @Test
    @DisplayName("매매 실패 테스트")
    void tradeFailTest() {
        //given
        TradeRecord tradeRecord = new TradeRecord(
                children,
                stock,
                40000,
                BigDecimal.valueOf(0.5),
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")),
                null, // 모르고 이유 입력 안 함
                "4",
                30000
        );


        //when & then
        // 데이터베이스에 저장할 때 예외가 발생해야 함
        ConstraintViolationException thrownException = assertThrows(ConstraintViolationException.class, () -> {
                    try {
                        entityManager.persist(tradeRecord);
                        entityManager.flush();
                    } catch (TransactionSystemException e) {
                        // TransactionSystemException의 원인으로 ConstraintViolationException을 던집니다.
                        if (e.getCause() instanceof ConstraintViolationException) {
                            throw (ConstraintViolationException) e.getCause();
                        } else {
                            throw e;
                        }
                    }
                });
    }

}
