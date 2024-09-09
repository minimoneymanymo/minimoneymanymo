package com.beautifulyomin.mmmm.domain.member.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import javax.annotation.Nullable;

@Data
public class JoinRequestDto {
    @NotNull
    private String userId ;
    @NotNull
    private String password ;
    @NotNull
    private String phoneNumber ;
    private String name ;
    private String role ;
    //이거는 부모만있음
    private String signedData ;
    private String ci;
    // 이거 아래는 자식만 있음
    // "birthDay" : "birthDay",
    // "parentsNumber" : "parents_number"
    private String birthDay;
    private String parentsNumber;

}
