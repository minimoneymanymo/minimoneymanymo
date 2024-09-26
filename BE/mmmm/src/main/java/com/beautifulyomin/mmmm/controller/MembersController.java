package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;

import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.member.dto.*;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.member.service.MailSendService;
import com.beautifulyomin.mmmm.exception.InvalidRequestException;
import com.beautifulyomin.mmmm.exception.InvalidRoleException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import com.beautifulyomin.mmmm.domain.member.service.ChildrenService;
import com.beautifulyomin.mmmm.domain.member.service.ParentService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.function.Function;

@RestController
@RequestMapping("/members")
@Slf4j
public class MembersController {
    private final ParentService parentService;
    private final ChildrenService childrenService;
    private final JWTUtil jwtUtil;
    private final MailSendService mailSendService;

    public MembersController(ParentService parentService, ChildrenService childrenService, JWTUtil jwtUtil, MailSendService mailSendService) {
        this.parentService = parentService;
        this.childrenService = childrenService;
        this.jwtUtil = jwtUtil;
        this.mailSendService = mailSendService;
    }

    @PostMapping("/checkid")
    public ResponseEntity<CommonResponseDto> checkId(@Valid @RequestBody EmailRequestDto emailRequestDto) {
        String email = emailRequestDto.getEmail(); // 이메일 추출

        // 자식 사용자와 부모 사용자 중복 체크
        boolean isEmailAvailable = !childrenService.isExistByUserId(email) && !parentService.isExistByUserId(email);
        //인증메일 발송
        if (isEmailAvailable) System.out.println("!!!!!!!!!!!" + mailSendService.joinEmail(email) + "!!!!!!!!!!!");
        ;

        CommonResponseDto commonResponseDto = CommonResponseDto.builder()
                .stateCode(isEmailAvailable ? 200 : 409)
                .message(isEmailAvailable ? "사용 가능한 이메일입니다. 인증 코드를 입력하세요." : "이미 사용중인 이메일입니다.")
                .build();
        return ResponseEntity.status(isEmailAvailable ? HttpStatus.OK : HttpStatus.CONFLICT)
                .body(commonResponseDto);
    }

    @PostMapping("/mailauthCheck")
    public ResponseEntity<CommonResponseDto> authCheck(@RequestBody @Valid EmailCheckDto emailCheckDto) {
        boolean isChecked = mailSendService.checkAuthNum(emailCheckDto.getEmail(), emailCheckDto.getAuthNum());
        return ResponseEntity.ok(
                CommonResponseDto.builder()
                        .stateCode(isChecked ? 200 : 401)
                        .message(isChecked ? "인증완료" : "인증실패")
                        .build()
        );
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
        if (joinDto.getRole().equals("0")) {
            savedUsername = parentService.registerParent(joinDto);
        } else if (joinDto.getRole().equals("1")) {
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
        if (!parentService.isExistByUserId(userId)) {
            throw new InvalidRoleException("부모가 아닙니다.");
        }

        List<MyChildrenDto> myChildrenDtoList = parentService.getMyChildren(userId);

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
    public ResponseEntity<CommonResponseDto> getMyChild(@RequestHeader("Authorization") String token, @PathVariable("childrenId") Integer childrenId) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if (!parentService.isExistByUserId(userId)) {
            throw new InvalidRoleException("부모가 아닙니다.");
        }

        MyChildDto myChild = parentService.getMyChild(userId, childrenId);
        if (myChild == null) {
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
    public ResponseEntity<CommonResponseDto> getMyChildWaiting(@RequestHeader("Authorization") String token) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if (!parentService.isExistByUserId(userId)) {
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
    public ResponseEntity<CommonResponseDto> addMyChildWaiting(@RequestHeader("Authorization") String token, @RequestBody MyChildrenWaitingDto myChildrenWaitingDto) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if (!parentService.isExistByUserId(userId)) {
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        int result = parentService.addMyChildren(userId, myChildrenWaitingDto.getChildrenId());
        // result : 0 인 경우 예외상황임
        if (result == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CommonResponseDto.builder()
                            .stateCode(404)
                            .message("없는관계인 경우")
                            .build());
        }
        // result : -1 인 경우 이미 수락된 경우임
        else if (result == -1) {
            throw new InvalidRequestException("예외");
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
    public ResponseEntity<CommonResponseDto> updateAllowance(@RequestHeader("Authorization") String token, @RequestBody MyChildDto requestDto) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if (!parentService.isExistByUserId(userId)) {
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        Integer childrenId = requestDto.getChildrenId();
        Integer settingMoney = requestDto.getSettingMoney();

        int result = parentService.setMyChildAllowance(userId, childrenId, settingMoney);
        // result : -1 인 경우
        if (result == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CommonResponseDto.builder()
                            .stateCode(404)
                            .message("부모자식관계가 아닌 경우")
                            .build());
        }
        // result : 0 인 경우 예외상황임
        else if (result == 0) {
            throw new InvalidRequestException("예외");
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
    public ResponseEntity<CommonResponseDto> setQuiz(@RequestHeader("Authorization") String token, @RequestBody MyChildDto requestDto) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if (!parentService.isExistByUserId(userId)) {
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        Integer childrenId = requestDto.getChildrenId();
        Integer settingQuizBonusMoney = requestDto.getSettingQuizBonusMoney();

        int result = parentService.setMyChildQuizBonusMoney(userId, childrenId, settingQuizBonusMoney);
        // result : -1 인 경우
        if (result == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CommonResponseDto.builder()
                            .stateCode(404)
                            .message("부모자식관계가 아닌 경우")
                            .build());
        }
        // result : 0 인 경우 예외상황임
        else if (result == 0) {
            throw new InvalidRequestException("예외");
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
    public ResponseEntity<CommonResponseDto> updateWithdraw(@RequestHeader("Authorization") String token, @RequestBody MyChildDto requestDto) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if (!parentService.isExistByUserId(userId)) {
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        Integer childrenId = requestDto.getChildrenId();
        Integer settingWithdrawableMoney = requestDto.getSettingWithdrawableMoney();

        int result = parentService.setMyChildWithdrawableMoney(userId, childrenId, settingWithdrawableMoney);
        // result : -1 인 경우
        if (result == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CommonResponseDto.builder()
                            .stateCode(404)
                            .message("부모자식관계가 아닌 경우")
                            .build());
        }
        // result : 0 인 경우 예외상황임
        else if (result == 0) {
            throw new InvalidRequestException("예외");
        }
        // result : 1 인 경우 머니 설정 성공
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("출금가능금액 설정 완료")
                        .build());
    }

    /**
     * 부모 - 마니모 계좌 환불
     */
    @PutMapping("/withdraw")
    public ResponseEntity<CommonResponseDto> withdrawBalance(
            @RequestHeader("Authorization") String token,
            @RequestParam("balance") Integer balance
    ) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if (!parentService.isExistByUserId(userId)) {
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        Parent parent = parentService.findByUserId(userId);
        if (parent.getBalance() < balance) {
            throw new InvalidRequestException("잔액보다 큰 금액을 환불할 수 없습니다.");
        }

        long result = parentService.updateBalance(userId, balance * -1);
        if (result == 0) {
            throw new InvalidRequestException("마니모 계좌 환불 실패");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("마니모 계좌 환불 완료")
                        .build());
    }

    /**
     * 부모 - 마니모 계좌 충전
     */
    @PutMapping("/deposit")
    public ResponseEntity<CommonResponseDto> depositBalance(
            @RequestHeader("Authorization") String token,
            @RequestParam("balance") Integer balance
    ) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if (!parentService.isExistByUserId(userId)) {
            throw new InvalidRoleException("부모가 아닙니다.");
        }

        long result = parentService.updateBalance(userId, balance);
        if (result == 0) {
            throw new InvalidRequestException("마니모 계좌 환불 실패");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("마니모 계좌 충전 완료")
                        .build());
    }

    @PutMapping("/link-account")
    public ResponseEntity<CommonResponseDto> updateAccount(
            @RequestHeader("Authorization") String token,
            @RequestBody AccountDto accountDto
    ) {
        long result;
        String userId = jwtUtil.getUsername(token);
        if (parentService.isExistByUserId(userId)) { // 부모
            result = parentService.updateAccount(userId, accountDto.getAccountNumber(), accountDto.getBankCode());
        } else if (childrenService.isExistByUserId(userId)) { // 자녀
            result = childrenService.updateAccount(userId, accountDto.getAccountNumber(), accountDto.getBankCode());
        } else {
            throw new InvalidRequestException("아이디와 일치하는 사용자가 없습니다");
        }

        if (result == 0) {
            throw new InvalidRequestException("계좌 연결 실패");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("계좌 연결 완료")
                        .build());
    }

    @GetMapping("/stock-info/{stockCode}")
    public ResponseEntity<CommonResponseDto> childInfo(@RequestHeader("Authorization") String token, @PathVariable("stockCode") String stockCode) {
        String userId = jwtUtil.getUsername(token);

        log.info("userId는 : {}", userId);

        ChildInfoDto childrenInfo = childrenService.childInfoByUserId(userId, stockCode);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("자식정보 조회 성공")
                        .data(childrenInfo)
                        .build());
    }


    @GetMapping("/info")
    public ResponseEntity<CommonResponseDto> findMemberInfo(
            @RequestHeader("Authorization") String token
    ) {
        String userId = jwtUtil.getUsername(token);

        Function<Object, CommonResponseDto> buildResponse = (data) ->
                CommonResponseDto.builder()
                        .stateCode(200)
                        .message("사용자 조회 완료")
                        .data(data)
                        .build();

        if (parentService.isExistByUserId(userId)) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(buildResponse.apply(parentService.findByUserId(userId)));
        }

        if (childrenService.isExistByUserId(userId)) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(buildResponse.apply(childrenService.findByUserId(userId)));
        }

        throw new InvalidRequestException("아이디와 일치하는 사용자가 없습니다");
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
