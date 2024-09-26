package com.beautifulyomin.mmmm.domain.stock.entity;

import com.beautifulyomin.mmmm.domain.stock.entity.key.DailyStockDataId;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@IdClass(DailyStockDataId.class)
public class DailyStockChart {
    @Id
    @Column(nullable = false)
    private String stockCode;

    @Id
    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal operatingPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal highestPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal lowestPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal closingPrice;

    @Column(nullable = false)
    private Long tradingVolume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stockCode", insertable = false, updatable = false)
    private Stock stock;
}
