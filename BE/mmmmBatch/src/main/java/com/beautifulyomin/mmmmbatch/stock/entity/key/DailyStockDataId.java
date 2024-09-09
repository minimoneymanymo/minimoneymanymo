package com.beautifulyomin.mmmmbatch.stock.entity.key;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;

@Embeddable
@Data
public class DailyStockDataId implements Serializable {
    private LocalDate date;
    private String stockCode;

}
