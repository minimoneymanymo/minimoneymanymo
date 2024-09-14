package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;

import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenWaitingDto;
import jakarta.validation.constraints.NotNull;

import com.beautifulyomin.mmmm.domain.member.dto.JoinRequestDto;
import com.beautifulyomin.mmmm.domain.member.service.ChildrenService;
import com.beautifulyomin.mmmm.domain.member.service.ParentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/members")
public class MembersController {
    private final ParentService parentService;
    private final ChildrenService childrenService;
    private final JWTUtil jwtUtil;

    public MembersController(ParentService parentService, ChildrenService childrenService, JWTUtil jwtUtil) {
        this.parentService = parentService;
        this.childrenService = childrenService;
        this.jwtUtil = jwtUtil;
    }
    @GetMapping("/checkid")
    public ResponseEntity<CommonResponseDto> checkId(@RequestParam("id") String id, @RequestParam("role") String role) {
        CommonResponseDto commonResponseDto = null;

        boolean result = false;
        if(role.equals("1")) result = !childrenService.isExistByUserId(id) ;
        else result = !parentService.isExistByUserId(id);

        if(result) {
            commonResponseDto = CommonResponseDto.builder()
                    .stateCode(200)
                    .message("사용 가능한 아이디입니다.")
                    .build();
            System.out.println("!!!!!!!!!!!!!!");
            return ResponseEntity.status(HttpStatus.OK)
                    .body(commonResponseDto);
        } else {
            commonResponseDto = CommonResponseDto.builder()
                    .stateCode(409)
                    .message("이미 존재하는 아이디입니다.")
                    .build();
            return ResponseEntity.status(HttpStatus.OK)
                    .body(commonResponseDto);
        }
    }

    @DeleteMapping()
    public ResponseEntity<CommonResponseDto> delete(@RequestHeader("Authorization") String token) {


        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("삭제 성공")
                        .data("")
                        .build());
    }


    @PostMapping("/join")
    public ResponseEntity<CommonResponseDto> registerUser(@RequestBody @NotNull JoinRequestDto joinDto) {
        //Exception 직접 설정 가능 예시코드
//        Optional.ofNullable(joinDto).orElseThrow(() -> new IllegalArgumentException("joinDto cannot be null"));


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

    /**
     * 부모 - 자식목록
     * 나의 자식 목록 조회
     */
    @GetMapping("/mychildren")
    public ResponseEntity<CommonResponseDto> getMyChildren(@RequestHeader("Authorization") String token) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if(!parentService.isExistByUserId(userId)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.builder()
                            .stateCode(401)
                            .message("부모가 아닙니다.")
                            .build());
        }

        List<MyChildrenDto> myChildrenDtoList= parentService.getMyChildren(userId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("나의 자식 목록 조회")
                        .data(myChildrenDtoList)
                        .build());
    }

    /**
     * 부모- 참여대기 인원확인
     */
    @GetMapping("/mychildren/waiting")
    public ResponseEntity<CommonResponseDto> getMyChildWaiting(@RequestHeader("Authorization") String token){
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if(!parentService.isExistByUserId(userId)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.builder()
                            .stateCode(401)
                            .message("부모가 아닙니다.")
                            .build());
        }
        List<MyChildrenWaitingDto> myChildrenWaitingList = parentService.getMyChildWaiting(userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("나의 승인대기 자식 목록 조회")
                        .data(myChildrenWaitingList)
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