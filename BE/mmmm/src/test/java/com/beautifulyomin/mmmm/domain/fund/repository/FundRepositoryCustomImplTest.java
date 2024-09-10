package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.config.QueryDslConfig;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;
import com.beautifulyomin.mmmm.domain.fund.entity.TransactionRecord;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@Import(QueryDslConfig.class)
class FundRepositoryCustomImplTest {

    @Autowired
    private FundRepositoryCustomImpl fundRepository;

    @Autowired
    private TestEntityManager entityManager;

    @BeforeAll
    static void setUp() {
        Dotenv dotenv = Dotenv.configure().load();
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );
    }

    @Test
    @DisplayName("아이디로 머니 기록 조회 테스트")
    void findAllMoneyRecordsById() {
        //given
        Children children = new Children(
                "semin",
                "김세민",
                "semin_pwd",
                "010-4321-4321",
                "200010050000"
        );

        entityManager.persist(children);

        Stock stock = new Stock(
                "1111111",                    // stockCode
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

        TransactionRecord transaction = new TransactionRecord(
                children,
                LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")),
                null,
                5000,
                "1",
                15000
        );
        entityManager.persist(transaction);

        TradeRecord trade = new TradeRecord(
                children,
                stock,
                3000,
                BigDecimal.ZERO,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")),
                "4",
                "매수가 하고 싶었습니다.",
                200,
                BigDecimal.valueOf(10)
        );
        entityManager.persist(trade);

        entityManager.flush();

        // when
        List<MoneyChangeDto> results = fundRepository.findAllMoneyRecordsById("semin");

        // then
        assertEquals(2, results.size());
        assertTrue(results.stream().anyMatch(dto -> dto.getTradeType().equals("1")));
        assertTrue(results.stream().anyMatch(dto -> dto.getTradeType().equals("4")));
    }

    @Test
    void findMoneyById() {
        // Implement your test logic here if needed
    }
}
