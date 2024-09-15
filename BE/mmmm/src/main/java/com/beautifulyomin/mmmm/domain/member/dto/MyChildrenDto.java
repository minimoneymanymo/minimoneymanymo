package com.beautifulyomin.mmmm.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MyChildrenDto {
    private Integer childrenId;
    private String userId;
    private String name;
    private String profileimgUrl;
    private LocalDateTime createdAt;
    private Integer money;
    private Integer withdrawableMoney;
    private BigDecimal totalAmount;
}
