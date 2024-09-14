package com.beautifulyomin.mmmm.domain.stock.entity.key;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyStockDataId implements Serializable {
    @Column(nullable = false)
    private LocalDate date;
    @Column(nullable = false)
    private String stockCode;
}