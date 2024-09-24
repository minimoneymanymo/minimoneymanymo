package com.beautifulyomin.mmmm.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChildInfoDto {
    private String userId;
    private Integer money;
    private String profileimgUrl;
    private String date;
    private Integer stockMoney;
    private BigDecimal remainSharesCount;
}
