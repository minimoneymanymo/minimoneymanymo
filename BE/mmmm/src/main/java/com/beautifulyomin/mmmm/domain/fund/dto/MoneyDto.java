package com.beautifulyomin.mmmm.domain.fund.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class MoneyDto {
    private Integer money;
    private Integer withdrawableMoney;
    private BigDecimal totalAmount;
}
