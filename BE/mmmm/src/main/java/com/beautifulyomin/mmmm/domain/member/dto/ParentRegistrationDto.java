package com.beautifulyomin.mmmm.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ParentRegistrationDto {
    private String userId;
    private String password;
    private String phoneNumber;
    private String name;
    private String signedData;
    private String ci;
}
