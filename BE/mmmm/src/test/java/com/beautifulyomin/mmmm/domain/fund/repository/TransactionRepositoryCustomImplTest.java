package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.config.QueryDslConfig;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.dto.WithdrawRequestDto;
import com.beautifulyomin.mmmm.domain.fund.entity.TradeRecord;
import com.beautifulyomin.mmmm.domain.fund.entity.TransactionRecord;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
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


    @Autowired
    public TransactionRepositoryCustomImplTest(FundRepositoryCustomImpl fundRepository, TestEntityManager entityManager) {
        this.fundRepository = fundRepository;
        this.entityManager = entityManager;

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

    @Test
    @DisplayName("부모-출금요청 승인")
    void approveWithdrawalRequestTest(){
        // 부모가 자녀의 출금요청을 승인하면
        // 부모의 잔액, 해당 출금요청의 승인일시, 자녀의 머니, 출가금 잔액이 변경되어야 함.
        Parent parent = new Parent(
                "parentId",
                "parentName",
                "parentPwd",
                "010-1111-1111"
        );
        parent.setBalance(30000);
        entityManager.persist(parent);

        children.setMoney(20000);
        children.setWithdrawableMoney(10000);
        entityManager.persist(children); // 변경값 반영

        TransactionRecord transactionRecord = new TransactionRecord(
                children,
                "20240901130000",
                1000, // 출금 요청한 금액
                "1",
                children.getMoney()
        );
        entityManager.persist(transactionRecord);
        entityManager.flush();

        long result = fundRepository.approveWithdrawalRequest(parent.getUserId(), children.getChildrenId(), 1000, "20240901130000");

        // 업데이트된 child, parent 값 다시 불러오기
        children = entityManager.find(Children.class, children.getChildrenId());
        parent = entityManager.find(Parent.class, parent.getParentId());

        TransactionRecord updatedTransactionRecord = entityManager
                .getEntityManager()
                .createQuery(
                        "SELECT t FROM TransactionRecord t WHERE t.createdAt = :createdAt AND t.children.id = :childrenId",
                        TransactionRecord.class)
                .setParameter("createdAt", "20240901130000")
                .setParameter("childrenId", children.getChildrenId())
                .getSingleResult();
        String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        assertEquals(1, result);
        // 출금요청이 승인되면 자식의 머니와 출금 가능 금액이 요청한 금액만큼 줄어야 함 + 승인일시 업데이트
        assertEquals(19000, children.getMoney()); // 출금 후 머니 잔액 확인
        assertEquals(9000, children.getWithdrawableMoney()); // 출금 후 출가금 잔액 확인
        assertEquals(currentDateTime, updatedTransactionRecord.getApprovedAt(), "The approvedAt timestamp should match the current time.");
        assertEquals(29000, parent.getBalance());
    }

    @Test
    @DisplayName("거래내역 조회")
    void findAllTradeRecords() {
        TradeRecord trade1 = new TradeRecord(
                children,
                stock,
                3000,
                BigDecimal.ZERO,
                "20240922161000",
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
                "20240922161100",
                "5",
                "매도가 하고 싶었습니다.",
                200,
                BigDecimal.valueOf(10),
                12000
        );
        TradeRecord trade3 = new TradeRecord(
                children,
                stock,
                5000,
                BigDecimal.ZERO,
                "20240822161000",
                "5",
                "매도가 하고 싶었습니다.",
                null,
                BigDecimal.valueOf(10),
                12000
        );
        entityManager.persist(trade1);
        entityManager.persist(trade2);
        entityManager.persist(trade3);
        entityManager.flush();

        List<TradeDto> result1 = fundRepository.findAllTradeRecord(children.getChildrenId(), 2024, 9);
        List<TradeDto> result2 = fundRepository.findAllTradeRecord(children.getChildrenId(), 2024, 8);

        System.out.println(result1);
        assertEquals(2, result1.size());
        for (int i = 0; i < result1.size() - 1; i++) {
            String currentCreatedAt = result1.get(i).getCreatedAt();
            String nextCreatedAt = result1.get(i + 1).getCreatedAt();
            assertTrue(currentCreatedAt.compareTo(nextCreatedAt) > 0, "CreatedAt is not in descending order");
        }
        assertEquals(1, result2.size());
    }
}
