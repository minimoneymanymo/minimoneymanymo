package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.entity.TransactionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionRecord, Integer> {

    // 보유 주식 조회
    // 주식 거래 내역 조회(=투자이유조회)
    //있는 거래 내역인지 확인
    Optional<TransactionRecord> findByTransactionId(Integer transactionId);
}
