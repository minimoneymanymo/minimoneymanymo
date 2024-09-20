package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;

import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenWaitingDto;
import com.beautifulyomin.mmmm.exception.InvalidRoleException;
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
            throw new InvalidRoleException("부모가 아닙니다.");
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
     * 부모- 자식 한명 조회
     */
    @GetMapping("/mychild/{childrenId}")
    public ResponseEntity<CommonResponseDto> getMyChild(@RequestHeader("Authorization") String token,@PathVariable("childrenId") Integer childrenId) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if(!parentService.isExistByUserId(userId)){
            throw new InvalidRoleException("부모가 아닙니다.");
        }

        MyChildDto myChild= parentService.getMyChild(userId, childrenId);
        if(myChild == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CommonResponseDto.builder()
                            .stateCode(404)
                            .message("나의 자식이 아님")
                            .data(null)
                            .build());
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("나의 자식 조회")
                        .data(myChild)
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
            throw new InvalidRoleException("부모가 아닙니다.");

        }
        List<MyChildrenWaitingDto> myChildrenWaitingList = parentService.getMyChildWaiting(userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("나의 승인대기 자식 목록 조회")
                        .data(myChildrenWaitingList)
                        .build());
    }

    /**
     * 부모 - 참여대기 인원승인
     */
    @PutMapping("/mychildren/waiting")
    public  ResponseEntity<CommonResponseDto> addMyChildWaiting(@RequestHeader("Authorization") String token, @RequestBody MyChildrenWaitingDto myChildrenWaitingDto) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if(!parentService.isExistByUserId(userId)){
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        int result = parentService.addMyChildren(userId,myChildrenWaitingDto.getChildrenId());
        // result : 0 인 경우 예외상황임
        if(result == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CommonResponseDto.builder()
                            .stateCode(404)
                            .message("없는관계인 경우")
                            .build());
        }
        // result : -1 인 경우 이미 수락된 경우임
        else if(result == -1) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(CommonResponseDto.builder()
                            .stateCode(400)
                            .message("이미 승인된 자식임")
                            .build());
        }
        // result : 1이상 인 경우 요청 승인 성공
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("요청 승인")
                        .build());

    }

    /**
     * 부모 - 용돈설정
     */
    @PutMapping("/mychild/setAllowance")
    public  ResponseEntity<CommonResponseDto>updateAllowance(@RequestHeader("Authorization") String token,@RequestBody MyChildDto requestDto) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if(!parentService.isExistByUserId(userId)){
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        Integer childrenId = requestDto.getChildrenId();
        Integer settingMoney = requestDto.getSettingMoney();

        int result = parentService.setMyChildAllowance(userId,childrenId,settingMoney);
        // result : -1 인 경우
        if(result == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CommonResponseDto.builder()
                            .stateCode(404)
                            .message("부모자식관계가 아닌 경우")
                            .build());
        }
        // result : 0 인 경우 예외상황임
        else if(result == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(CommonResponseDto.builder()
                            .stateCode(400)
                            .message("예외")
                            .build());
        }
        // result : 1 인 경우 머니 설정 성공
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("머니 설정 완료")
                        .build());
    }

    /**
     * 부모 - 퀴즈보상머니설정
     */
    @PutMapping("/mychild/setQuiz")
    public  ResponseEntity<CommonResponseDto>setQuiz(@RequestHeader("Authorization") String token,@RequestBody MyChildDto requestDto) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if(!parentService.isExistByUserId(userId)){
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        Integer childrenId = requestDto.getChildrenId();
        Integer settingQuizBonusMoney = requestDto.getSettingQuizBonusMoney();

        int result = parentService.setMyChildQuizBonusMoney(userId,childrenId,settingQuizBonusMoney);
        // result : -1 인 경우
        if(result == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CommonResponseDto.builder()
                            .stateCode(404)
                            .message("부모자식관계가 아닌 경우")
                            .build());
        }
        // result : 0 인 경우 예외상황임
        else if(result == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(CommonResponseDto.builder()
                            .stateCode(400)
                            .message("예외")
                            .build());
        }
        // result : 1 인 경우 머니 설정 성공
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("머니 설정 완료")
                        .build());
    }
    /**
     * 부모 - 출금가능금액 설정
     */
    @PutMapping("/mychild/setWithdraw")
    public  ResponseEntity<CommonResponseDto>updateWithdraw(@RequestHeader("Authorization") String token,@RequestBody MyChildDto requestDto) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if(!parentService.isExistByUserId(userId)){
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        Integer childrenId = requestDto.getChildrenId();
        Integer settingWithdrawableMoney = requestDto.getSettingWithdrawableMoney();

        int result = parentService.setMyChildWithdrawableMoney(userId,childrenId,settingWithdrawableMoney);
        // result : -1 인 경우
        if(result == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CommonResponseDto.builder()
                            .stateCode(404)
                            .message("부모자식관계가 아닌 경우")
                            .build());
        }
        // result : 0 인 경우 예외상황임
        else if(result == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(CommonResponseDto.builder()
                            .stateCode(400)
                            .message("예외")
                            .build());
        }
        // result : 1 인 경우 머니 설정 성공
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("출금가능금액 설정 완료")
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