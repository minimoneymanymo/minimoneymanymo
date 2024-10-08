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
public class StocksHeld {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "children_id", nullable = false)
    private Children children;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_code", nullable = false)
    private Stock stock;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer stocksHeldId;

    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal remainSharesCount;

    @Column(nullable = false)
    private Integer totalAmount;
}
