package com.beautifulyomin.mmmmbatch.batch.analysis.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "row_report_values")
public class RowReportValue { //investment_reports_v2

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer childrenId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private int tradeCount;  // 거래 횟수

    @Column(nullable = false)
    private int cashAmount;  // 현금 보유량

    @Column(nullable = false)
    private BigDecimal stockValue;  // 주식 보유 가치

    @Column(nullable = false)
    private BigDecimal realizedGains;  // 실현 이익

    @Column(nullable = false)
    private BigDecimal realizedLosses;  // 실현 손실

    public RowReportValue(Integer childrenId, LocalDate date, int tradeCount, int cashAmount, BigDecimal stockValue, BigDecimal realizedGains, BigDecimal realizedLosses) {
        this.childrenId = childrenId;
        this.date = date;
        this.tradeCount = tradeCount;
        this.cashAmount = cashAmount;
        this.stockValue = stockValue;
        this.realizedGains = realizedGains;
        this.realizedLosses = realizedLosses;
    }
}