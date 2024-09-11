package com.beautifulyomin.mmmm.domain.stock.entity;

import com.beautifulyomin.mmmm.domain.stock.entity.key.DailyStockDataId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "daily_stock_chart")
@Getter
@Setter
@NoArgsConstructor
public class DailyStockChart {
    @EmbeddedId
    private DailyStockDataId id;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal operatingPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal highestPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal lowestPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal closingPrice;

    @Column(nullable = false, columnDefinition = "BIGINT")
    private Long tradingVolume;
}
