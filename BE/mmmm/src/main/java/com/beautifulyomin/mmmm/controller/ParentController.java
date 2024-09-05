package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.member.dto.ParentRegistrationDto;
import com.beautifulyomin.mmmm.member.service.ParentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/parents")
public class ParentController {
    private final ParentService parentService;

    @Autowired
    public ParentController(ParentService parentService) {
        this.parentService = parentService;
    }

    @PostMapping()
    public ResponseEntity<CommonResponseDto> registerUser(@RequestBody ParentRegistrationDto parentDto) {
        String savedUsername = parentService.registerParent(parentDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("회원가입 성공")
                        .data(savedUsername)
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