package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyDto;
import com.beautifulyomin.mmmm.domain.fund.dto.WithdrawDto;
import com.beautifulyomin.mmmm.domain.fund.dto.WithdrawRequestDto;
import com.beautifulyomin.mmmm.domain.fund.service.FundService;
import com.beautifulyomin.mmmm.domain.member.service.ParentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/funds")
public class FundController {

    private final ParentService parentService;
    private final FundService fundService;
    private final JWTUtil jwtUtil;

    public FundController(ParentService parentService, FundService fundService, JWTUtil jwtUtil) {
        this.parentService = parentService;
        this.fundService = fundService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/money-list")
    public ResponseEntity<CommonResponseDto> findAllMoneyRecordsById(@RequestHeader("Authorization") String token) {
        String userId = jwtUtil.getUsername(token);
        List<MoneyChangeDto> moneyList = fundService.findAllMoneyRecordsById(userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("머니사용내역 조회 성공")
                        .data(moneyList)
                        .build());
    }

    @GetMapping
    public ResponseEntity<CommonResponseDto> findMoneyById(@RequestHeader("Authorization") String token) {
        String userId = jwtUtil.getUsername(token);
        MoneyDto money = fundService.findMoneyById(userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("보유자금 조회 성공")
                        .data(money)
                        .build());
    }

    @PostMapping("/request-withdraw")
    public ResponseEntity<CommonResponseDto> requestWithdraw(@RequestHeader("Authorization") String token, @RequestBody WithdrawDto amount) {
        String userId = jwtUtil.getUsername(token);
        fundService.requestWithdraw(userId, amount.getWithdrawableMoney());
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("출금요청 성공")
                        .data(null)
                        .build());
    }

    /**
     * 자식-출금 요청 내역 조회
     */
    @GetMapping("/withdraw-list")
    public ResponseEntity<CommonResponseDto> findAllWithdrawRequest(@RequestHeader("Authorization") String token) {
        String userId = jwtUtil.getUsername(token);
        List<WithdrawRequestDto> allWithdrawRequest = fundService.findAllWithdrawRequest(userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("자녀-출금요청내역 조회 성공")
                        .data(allWithdrawRequest)
                        .build());
    }

    /**
     * 부모-출금 요청 내역 조회
     */
    @GetMapping("/child-withdraw-list")
    public ResponseEntity<CommonResponseDto> findAllWithdrawRequestFromParent(@RequestHeader("Authorization") String token, @RequestParam("childrenId") String childrenId) {
        String userId = jwtUtil.getUsername(token);
        if(!parentService.isExistByUserId(userId)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.builder()
                            .stateCode(401)
                            .message("부모가 아닙니다.")
                            .build());
        }

        List<WithdrawRequestDto> allWithdrawRequest = fundService.findAllWithdrawRequest(childrenId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("부모-출금요청내역 조회 성공")
                        .data(allWithdrawRequest)
                        .build());
    }
}
