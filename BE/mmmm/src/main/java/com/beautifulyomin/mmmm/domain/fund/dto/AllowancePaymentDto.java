package com.beautifulyomin.mmmm.domain.fund.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllowancePaymentDto  {
    @NotNull
    private Integer transactionId;

    private Integer childrenId;

    private String createdAt;

    private Integer amount;

    private String name;

    public AllowancePaymentDto(Integer transactionId, Integer childrenId, Integer amount) {
        this.transactionId = transactionId;
        this.childrenId = childrenId;
        this.amount = amount;
    }

    public AllowancePaymentDto(Integer childrenId, Integer amount) {
        this.childrenId = childrenId;
        this.amount = amount;
    }
}
