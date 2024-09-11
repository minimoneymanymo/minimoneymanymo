package com.beautifulyomin.mmmm.domain.fund.entity;

import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.stock.entity.Stock;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "trade_records")
@Getter
@Setter
@NoArgsConstructor
public class TradeRecord {

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

    @Column(precision = 10, scale = 6)
    private BigDecimal stockTradingGain;

    @Column(nullable = false, length = 14)
    private String createdAt;

    @Column(nullable = false, length = 1)
    private String tradeType;

    @Column(nullable = false, length = 1000)
    private String reason;

    @Column
    private Integer reasonBonusMoney;

    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal tradeSharesCount;

    public TradeRecord(Children children, Stock stock, Integer amount, BigDecimal stockTradingGain, String createdAt, String tradeType, String reason, Integer reasonBonusMoney, BigDecimal tradeSharesCount) {
        this.children = children;
        this.stock = stock;
//        this.tradeRecordId = tradeRecordId;
        this.amount = amount;
        this.stockTradingGain = stockTradingGain;
        this.createdAt = createdAt;
        this.tradeType = tradeType;
        this.reason = reason;
        this.reasonBonusMoney = reasonBonusMoney;
        this.tradeSharesCount = tradeSharesCount;
    }

    @PrePersist
    protected void onCreate() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        this.createdAt = LocalDateTime.now().format(formatter);
    }

}
