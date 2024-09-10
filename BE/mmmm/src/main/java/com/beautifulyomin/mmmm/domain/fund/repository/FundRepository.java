package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.entity.TransactionRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FundRepository extends JpaRepository<TransactionRecord, Integer>, FundRepositoryCustom {

    // 머니 사용 기록
    // List<MoneyChangeDto> findAllMoneyRecordsById(Integer childrenId);

    // 자금 조회(머니, 출가금 잔액, 평가금)
    // 출금 요청
    // 출금 요청 내역 조회
    // 보유 주식 조회
    // 주식 거래 내역 조회(=투자이유조회)
}
