package com.beautifulyomin.mmmm.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyChildDto {
    private Integer childrenId;
    private String userId;
    private String name;
    private String profileimgUrl;
    private Integer money;
    private Integer withdrawableMoney;
    private BigDecimal totalAmount;
    private Integer settingMoney;
    private Integer settingWithdrawableMoney;
    private Integer settingQuizBonusMoney;
    private String accountNumber;
    private LocalDateTime createdAt;
}
