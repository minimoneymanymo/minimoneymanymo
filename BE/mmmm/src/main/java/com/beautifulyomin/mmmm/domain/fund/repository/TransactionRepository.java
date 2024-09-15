package com.beautifulyomin.mmmm.domain.fund.repository;

import com.beautifulyomin.mmmm.domain.fund.dto.WithdrawRequestDto;
import com.beautifulyomin.mmmm.domain.fund.entity.TransactionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<TransactionRecord, Integer> {

    // 자녀-출금 요청 내역
    // select * from transaction_record where trade_type = tradeType and children_id = childrenId
    @Query("SELECT new com.beautifulyomin.mmmm.domain.fund.dto.WithdrawRequestDto(t.createdAt, t.approvedAt, t.amount) " +
            "FROM TransactionRecord t WHERE t.tradeType = :tradeType AND t.children.childrenId = :childrenId")
    List<WithdrawRequestDto> findByTradeTypeAndChildren_ChildrenId(@Param("tradeType") String tradeType,
                                                                   @Param("childrenId") Integer childrenId);
    // 보유 주식 조회
    // 주식 거래 내역 조회(=투자이유조회)
}
