package com.beautifulyomin.mmmm.domain.stock.dto.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;

@AllArgsConstructor
@Getter
@Builder
public class DailyStockChartDto  implements Serializable {
    private LocalDate date;
    private BigDecimal highestPrice;
    private BigDecimal lowestPrice;
    private BigInteger tradingVolume;
    private BigDecimal operatingPrice;
    private BigDecimal closingPrice;
}
