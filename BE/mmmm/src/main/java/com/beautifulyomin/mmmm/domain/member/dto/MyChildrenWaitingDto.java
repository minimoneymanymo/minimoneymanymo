package com.beautifulyomin.mmmm.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MyChildrenWaitingDto {
    private Integer childrenId;
    private String userId;
    private String name;
    private LocalDateTime createdAt;
}
