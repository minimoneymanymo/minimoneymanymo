package com.beautifulyomin.mmmmbatch.batch.stock.entity;

import com.beautifulyomin.mmmmbatch.batch.stock.entity.key.DailyStockDataId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "stock_52week_data")
@IdClass(DailyStockDataId.class)
public class Stock52weekData {

    @Id
    @Column(nullable = false)
    private String stockCode;

    @Id
    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private Long high52Week;

    @Column(nullable = false)
    private LocalDate high52WeekDate;

    @Column(nullable = false)
    private Long low52Week;

    @Column(nullable = false)
    private LocalDate low52WeekDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stockCode", insertable = false, updatable = false)
    private Stock stock;
}
