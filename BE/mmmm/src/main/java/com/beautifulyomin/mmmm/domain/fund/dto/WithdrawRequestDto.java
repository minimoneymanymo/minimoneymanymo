package com.beautifulyomin.mmmm.domain.fund.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WithdrawRequestDto {
    @NotNull
    private String createdAt;
    private String approvedAt;
    @NotNull
    private Integer amount;
}
