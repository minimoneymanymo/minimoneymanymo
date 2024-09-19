package com.beautifulyomin.mmmm.domain.fund.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawalApproveDto {
    @NotNull
    String childrenId;
    @NotNull
    String createdAt;
    @NotNull
    Integer amount;
}
