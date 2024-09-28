package com.beautifulyomin.mmmmbatch.batch.analysis.entity;

import com.beautifulyomin.mmmmbatch.batch.stock.entity.Stock;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "stocks_held")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class StocksHeld { // 주식보유내역

    @ManyToOne(fetch = FetchType.LAZY) // 자식1 : 내역n
    @JoinColumn(name = "children_id", nullable = false)
    private Children children; // 비식별 관계 설정을 위한 참조 필드

    @ManyToOne(fetch = FetchType.LAZY) // 종목1 : 내역n
    @JoinColumn(name = "stock_code", nullable = false)
    private Stock stock; // 비식별 관계 설정을 위한 참조 필드

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer stocksHeldId;

    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal remainSharesCount;

    @Column(nullable = false)
    private Integer totalAmount;
}
