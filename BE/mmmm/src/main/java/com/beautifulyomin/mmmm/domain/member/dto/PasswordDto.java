package com.beautifulyomin.mmmm.domain.member.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PasswordDto {
    @NotNull
    private String userId;
    @NotNull
    private String password;
    private String role;
}
