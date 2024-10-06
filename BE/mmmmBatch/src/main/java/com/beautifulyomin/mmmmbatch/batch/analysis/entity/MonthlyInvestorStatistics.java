package com.beautifulyomin.mmmmbatch.batch.analysis.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "monthly_investor_statistics")
public class MonthlyInvestorStatistics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer childrenId;

    @Column(nullable = false)
    private LocalDate date;

    @Column()
    private Long tradeCount;

    @Column()
    private Double avgCashAmount;

    @Column()
    private Integer stockValue;

    @Column()
    private Integer realizedGains;

    @Column()
    private Integer realizedLosses;

    @Column()
    private Integer stockTypeCount;

    @Column()
    private Integer kospiStockCount;

    @Column()
    private Integer totalBuyAmount;

    @Column()
    private Integer totalSellAmount;

    @Column()
    private Double averageTradeSize;

//    @Column(nullable = false)
//    private Double monthlyReturn;
//
//    @Column(nullable = false)
//    private Double portfolioVolatility;

    @Column()
    private Double winRate;

    @Column()
    private Double averageHoldingPeriod;

}