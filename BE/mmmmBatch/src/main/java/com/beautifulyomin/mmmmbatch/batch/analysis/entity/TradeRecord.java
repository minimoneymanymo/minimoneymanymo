package com.beautifulyomin.mmmmbatch.batch.analysis.entity;

import com.beautifulyomin.mmmmbatch.batch.stock.entity.Stock;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "trade_records")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TradeRecord { // 매수매도 거래내역

    @ManyToOne(fetch = FetchType.LAZY) // 자식1 : 내역n
    @JoinColumn(name = "children_id", nullable = false)
    private Children children; // 비식별 관계 설정을 위한 참조 필드

    @ManyToOne(fetch = FetchType.LAZY) // 종목1 : 내역n
    @JoinColumn(name = "stock_code", nullable = false)
    private Stock stock; // 비식별 관계 설정을 위한 참조 필드

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tradeRecordId;

    @Column(nullable = false)
    private Integer amount;

    @Column(precision = 10, scale = 2)
    private BigDecimal stockTradingGain = null;

    @Column(nullable = false, length = 14)
    private String createdAt;

    @Column(nullable = false, length = 1)
    private String tradeType;

    @Column(nullable = false, length = 1000)
    private String reason;

    @Column
    private Integer reasonBonusMoney = null;

    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal tradeSharesCount;

    @Column(nullable = false)
    private Integer remainAmount;

}
