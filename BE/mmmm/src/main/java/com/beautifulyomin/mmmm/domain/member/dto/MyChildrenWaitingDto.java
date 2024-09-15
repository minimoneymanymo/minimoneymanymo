package com.beautifulyomin.mmmm.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyChildrenWaitingDto {
    private Integer childrenId;
    private String userId;
    private String name;
    private LocalDateTime createdAt;

    public MyChildrenWaitingDto(Integer childrenId) {
        this.childrenId = childrenId;
    }

}
