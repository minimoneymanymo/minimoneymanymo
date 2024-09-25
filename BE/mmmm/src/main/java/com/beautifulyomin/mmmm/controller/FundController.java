package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.fund.dto.*;
import com.beautifulyomin.mmmm.domain.fund.service.FundService;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.member.service.ParentService;
import com.beautifulyomin.mmmm.exception.InvalidRequestException;
import com.beautifulyomin.mmmm.exception.InvalidRoleException;
import jakarta.validation.Valid;
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
    public ResponseEntity<CommonResponseDto> findAllWithdrawRequestFromParent(
            @RequestHeader("Authorization") String token,
            @RequestParam("childrenId") String childrenId
    ) {
        String userId = jwtUtil.getUsername(token);
        if(!parentService.isExistByUserId(userId)){
            throw new InvalidRoleException("부모가 아닙니다.");
        }

        List<WithdrawRequestDto> allWithdrawRequest = fundService.findAllWithdrawRequest(childrenId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("부모-출금요청내역 조회 성공")
                        .data(allWithdrawRequest)
                        .build());
    }

    /**
     * 부모-출금 요청 승인
     */
    @PutMapping("/approve-request")
    public ResponseEntity<CommonResponseDto> approveWithdrawalRequest(
            @RequestHeader("Authorization") String token,
            @RequestBody @Valid WithdrawalApproveDto approve
    ) {
        String userId = jwtUtil.getUsername(token);
        if(!parentService.isExistByUserId(userId)){
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        Parent parent = parentService.findByUserId(userId);
        if(parent.getBalance() < approve.getAmount()){
            throw new InvalidRequestException("출금 요청 금액이 마니모 계좌 잔액보다 큽니다.");
        }

        long result = fundService.approveWithdrawalRequest(userId, approve.getChildrenId(), approve.getAmount(), approve.getCreatedAt());
        if(result == 0){
            throw new InvalidRequestException("요청에 해당하는 내역이 없습니다.");
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("부모-출금요청 승인 성공")
                        .data(null)
                        .build());
    }

    /**
     * 자식-거래내역 조회
     */
    @GetMapping("/trade-list")
    public ResponseEntity<CommonResponseDto> findAllTradeRecords(
            @RequestHeader("Authorization") String token,
            @RequestParam("year") Integer year,
            @RequestParam("month") Integer month
    ) {
        String userId = jwtUtil.getUsername(token);

        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("자식-거래내역 조회 성공")
                        .data(fundService.findAllTradeRecord(userId, year, month))
                        .build());
    }

    /**
     * 부모-자식 투자일기(거래내역) 조회
     */
    @GetMapping("/child-trade-list")
    public ResponseEntity<CommonResponseDto> findAllTradeRecords(
            @RequestHeader("Authorization") String token,
            @RequestParam("childrenId") String childrenId,
            @RequestParam("year") Integer year,
            @RequestParam("month") Integer month
    ) {
        String userId = jwtUtil.getUsername(token);
        if(!parentService.isExistByUserId(userId)){
            throw new InvalidRoleException("부모가 아닙니다.");
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("부모-자식 투자일기(거래내역) 조회")
                        .data(fundService.findAllTradeRecord(childrenId, year, month))
                        .build());
    }

    /**
     * 보유 주식 조회
     */
    @GetMapping("/stocks")
    public ResponseEntity<CommonResponseDto> findAllStockHeld(
            @RequestHeader("Authorization") String token
    ) {
        String userId = jwtUtil.getUsername(token);

        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("보유 주식 조회")
                        .data(fundService.findAllStockHeld(userId))
                        .build());
    }
}
