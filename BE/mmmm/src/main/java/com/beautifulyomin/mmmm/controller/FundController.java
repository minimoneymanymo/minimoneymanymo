package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyChangeDto;
import com.beautifulyomin.mmmm.domain.fund.dto.MoneyDto;
import com.beautifulyomin.mmmm.domain.fund.dto.WithdrawDto;
import com.beautifulyomin.mmmm.domain.fund.entity.TransactionRecord;
import com.beautifulyomin.mmmm.domain.fund.service.FundService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/funds")
public class FundController {

    private final FundService fundService;
    private final JWTUtil jwtUtil;


    public FundController(FundService fundService, JWTUtil jwtUtil) {
        this.fundService = fundService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/money_list")
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

    @PostMapping("/request_withdraw")
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
}
