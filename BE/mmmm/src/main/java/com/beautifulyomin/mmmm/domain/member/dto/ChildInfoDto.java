package com.beautifulyomin.mmmm.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChildInfoDto {
    private String userId;
    private Integer money;
    private String profileimgUrl;
    private String date;
}
