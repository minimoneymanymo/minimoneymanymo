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
        TransactionRecord request1 = new TransactionRecord();
        request1.setChildren(child);
        request1.setAmount(1000);
        request1.setTradeType("1");
        request1.setRemainAmount(child.getMoney());

        TransactionRecord request2 = new TransactionRecord();
        request2.setChildren(child);
        request2.setAmount(2500);
        request2.setTradeType("1");
        request2.setRemainAmount(child.getMoney());

        entityManager.persist(request1);
        entityManager.persist(request2);

        entityManager.flush();

        List<WithdrawRequestDto> results = transactionRepository.findByTradeTypeAndChildren_ChildrenId("1", child.getChildrenId());
        assertEquals(2, results.size());
        assertTrue(results.stream().allMatch(dto -> dto.getAmount() > 0));

    }
}