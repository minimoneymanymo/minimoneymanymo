package com.beautifulyomin.mmmmbatch.batch.analysis.entity;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.key.InvestmentReportId;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.Range;


import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "investment_reports_v2")
public class InvestmentReportV2 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer childrenId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private Long tradeCount;  // 거래 횟수

    @Column(nullable = false)
    private BigDecimal cashAmount;  // 현금 보유량

    @Column(nullable = false)
    private BigDecimal stockValue;  // 주식 보유 가치

    @Column(nullable = false)
    private BigDecimal realizedGains;  // 실현 이익

    @Column(nullable = false)
    private BigDecimal realizedLosses;  // 실현 손실

    @Column(nullable = false)
    private Integer stockTypeCount;  // 보유 주식 종류 수

    @Column(nullable = false)
    private Integer kospiStockCount;  // KOSPI 주식 보유 수
}