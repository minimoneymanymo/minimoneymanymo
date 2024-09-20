package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.config.QueryDslConfig;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.dto.WithdrawRequestDto;
import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;
import com.beautifulyomin.mmmm.domain.fund.entity.TransactionRecord;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.core.env.Environment;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@TestPropertySource(locations = "classpath:application-test.properties")
@DataJpaTest
@Import({FundRepositoryCustomImpl.class, QueryDslConfig.class}) // 필요한 빈 수동 등록
class TransactionRepositoryCustomImplTest {

    private final FundRepositoryCustomImpl fundRepository;
    private final TestEntityManager entityManager;
    private final Environment environment;

    @Autowired
    public TransactionRepositoryCustomImplTest(FundRepositoryCustomImpl fundRepository, TestEntityManager entityManager, Environment environment) {
        this.fundRepository = fundRepository;
        this.entityManager = entityManager;
        this.environment = environment;

    }

    static Children children;
    static Stock stock;

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
                "semin",
                "김세민",
                "semin_pwd",
                "010-4321-4321",
                "200010050000"
        );

        entityManager.persist(children); //영속성 컨텍스트에 등록

        stock = new Stock(
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
    }

    @Test
    @DisplayName("아이디로 머니 기록 조회 성공 테스트")
    void findAllMoneyRecordsByIdSuccessTest() {
        //given
        TransactionRecord transaction = new TransactionRecord(
                children,
                LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")),
                5000,
                "1",
                15000
        );
        entityManager.persist(transaction);

        TradeRecord trade1 = new TradeRecord( //여러개 할 거면 객체 여러개 만들고 entityManager에 persist 각각 해주면 됨.
                children,
                stock,
                3000,
                BigDecimal.ZERO,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")),
                "4",
                "매수가 하고 싶었습니다.",
                200,
                BigDecimal.valueOf(10),
                7000
        );
        TradeRecord trade2 = new TradeRecord(
                children,
                stock,
                5000,
                BigDecimal.ZERO,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")),
                "5",
                "매도가 하고 싶었습니다.",
                200,
                BigDecimal.valueOf(10),
                12000
        );
        entityManager.persist(trade1);
        entityManager.persist(trade2);

        entityManager.flush();

        // when
        List<MoneyChangeDto> results = fundRepository.findAllMoneyRecordsById("semin");

        // then
        assertEquals(3, results.size());
        assertTrue(results.stream().anyMatch(dto -> dto.getTradeType().equals("1")));
        assertTrue(results.stream().anyMatch(dto -> dto.getTradeType().equals("4")));
        assertTrue(results.stream().anyMatch(dto -> dto.getTradeType().equals("5")));
    }

    @Test
    @DisplayName("아이디로 머니 기록 조회 실패 테스트")
        //가능하면 실패 테스트도 하면 좋긴 한데 시간 없으면 패스~~
    void findAllMoneyRecordsByIdFailureTest() {

    }

    @Test
    @DisplayName("부모-자식의 출금요청내역 조회")
    void findByTradeTypeAndChildren_ChildrenId() {
        TransactionRecord request1 = new TransactionRecord(children, "20240901130000", 1000, "1", children.getMoney());
        TransactionRecord request2 = new TransactionRecord(children, "20240902130000", 2500, "1", children.getMoney());
        TransactionRecord request3 = new TransactionRecord(children, "20240903130000", 4500, "1", children.getMoney());
        TransactionRecord request4 = new TransactionRecord(children, "20240904130000", 6500, "1", children.getMoney());
        TransactionRecord request5 = new TransactionRecord(children, "20240905130000", 9500, "1", children.getMoney());
        TransactionRecord request6 = new TransactionRecord(children, "20240906130000", 12500, "1", children.getMoney());

        entityManager.persist(request1);
        entityManager.persist(request2);
        entityManager.persist(request3);
        entityManager.persist(request4);
        entityManager.persist(request5);
        entityManager.persist(request6);

        entityManager.flush();

        List<WithdrawRequestDto> results = fundRepository.findAllWithdrawalRequest(children.getChildrenId());
        assertEquals(5, results.size());
        assertTrue(results.stream().allMatch(dto -> dto.getAmount() > 0));
        // 최신순 정렬 확인
        for (int i = 0; i < results.size() - 1; i++) {
            String currentCreatedAt = results.get(i).getCreatedAt();
            String nextCreatedAt = results.get(i + 1).getCreatedAt();
            assertTrue(currentCreatedAt.compareTo(nextCreatedAt) > 0, "CreatedAt is not in descending order");
        }
    }
}
