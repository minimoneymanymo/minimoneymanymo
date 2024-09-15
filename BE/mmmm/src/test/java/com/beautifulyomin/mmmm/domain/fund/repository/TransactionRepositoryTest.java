package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.dto.WithdrawRequestDto;
import com.beautifulyomin.mmmm.domain.fund.entity.TransactionRecord;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class TransactionRepositoryTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TestEntityManager entityManager;

    static Children child;

    @BeforeAll
    static void setUp() {  //모든 메서드 실행 전 딱 한 번
        Dotenv dotenv = Dotenv.configure().load();
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );
    }

    @BeforeEach
    void init() {
        child = new Children(
                "자식id",
                "자식이름",
                "자식pwd",
                "010-4321-4321",
                "200010050000"
        );

        entityManager.persist(child);
    }


    @Test
    @DisplayName("부모-자식의 출금요청내역 조회")
    void findByTradeTypeAndChildren_ChildrenId() {
        TransactionRecord request1 = new TransactionRecord(child, "20240901130000", 1000, "1", child.getMoney());
        TransactionRecord request2 = new TransactionRecord(child, "20240902130000", 2500, "1", child.getMoney());
        TransactionRecord request3 = new TransactionRecord(child, "20240903130000", 4500, "1", child.getMoney());
        TransactionRecord request4 = new TransactionRecord(child, "20240904130000", 6500, "1", child.getMoney());
        TransactionRecord request5 = new TransactionRecord(child, "20240905130000", 9500, "1", child.getMoney());
        TransactionRecord request6 = new TransactionRecord(child, "20240906130000", 12500, "1", child.getMoney());

        entityManager.persist(request1);
        entityManager.persist(request2);
        entityManager.persist(request3);
        entityManager.persist(request4);
        entityManager.persist(request5);
        entityManager.persist(request6);

        entityManager.flush();

        List<WithdrawRequestDto> results = transactionRepository.findTop5ByTradeTypeAndChildren_ChildrenId(
                "1", child.getChildrenId(), PageRequest.of(0, 5)
        );
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