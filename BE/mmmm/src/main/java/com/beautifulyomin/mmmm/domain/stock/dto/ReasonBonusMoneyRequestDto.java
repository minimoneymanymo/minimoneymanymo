package com.beautifulyomin.mmmm.domain.stock.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReasonBonusMoneyRequestDto {
    @NotNull
    private String childrenUserId;
    @NotNull
    private String createdAt;
    @NotNull
    private Integer reasonBonusMoney;
}
