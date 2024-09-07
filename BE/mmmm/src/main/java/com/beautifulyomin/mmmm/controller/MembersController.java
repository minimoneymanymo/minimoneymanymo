package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.member.dto.JoinRequestDto;
import com.beautifulyomin.mmmm.member.dto.ParentRegistrationDto;
import com.beautifulyomin.mmmm.member.service.ChildrenService;
import com.beautifulyomin.mmmm.member.service.ParentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/members")
public class MembersController {
    private final ParentService parentService;
    private final ChildrenService childrenService;

    @Autowired
    public MembersController(ParentService parentService, ChildrenService childrenService) {
        this.parentService = parentService;
        this.childrenService = childrenService;
    }

    @PostMapping("/join")
    public ResponseEntity<CommonResponseDto> registerUser(@RequestBody JoinRequestDto joinDto) {
        //Exception 직접 설정 가능 예시코드
        Optional.ofNullable(joinDto).orElseThrow(() -> new IllegalArgumentException("joinDto cannot be null"));


        String savedUsername = null;
        if(joinDto.getRole().equals("0")) {
            savedUsername = parentService.registerParent(joinDto);
        }else if(joinDto.getRole().equals("1")) {
            savedUsername = childrenService.registerChildren(joinDto);
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("회원가입 성공")
                        .data(savedUsername)
                        .build());
    }

    @GetMapping("/authorization")
    public ResponseEntity<CommonResponseDto> getAuthorization() {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("토큰검증완료!")
                        .build());
    }



    @PostMapping("/image")
    public ResponseEntity<CommonResponseDto> profileImageUpload(
            @RequestPart("file") MultipartFile file) throws IOException {
        String imageUrl = parentService.uploadProfileImage(file);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new CommonResponseDto(201, "파일 업로드 성공", imageUrl));
    }
}