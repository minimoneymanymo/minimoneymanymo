package com.beautifulyomin.mmmm.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ParentWithBalanceDto {
    private Integer parentId;
    private Integer balance;
}
