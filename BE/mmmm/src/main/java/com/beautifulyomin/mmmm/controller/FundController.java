package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.JsonRequestUtil;
import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.fund.dto.*;
import com.beautifulyomin.mmmm.domain.fund.service.FundService;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.member.service.ChildrenService;
import com.beautifulyomin.mmmm.domain.member.service.ParentService;
import com.beautifulyomin.mmmm.exception.InvalidRequestException;
import com.beautifulyomin.mmmm.exception.InvalidRoleException;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;

import java.util.List;

@RestController
@RequestMapping("/funds")
public class FundController {

    private final ChildrenService childrenService;
    private final ParentService parentService;
    private final FundService fundService;
    private final JWTUtil jwtUtil;
    private final JsonRequestUtil jsonRequestUtil;
    private final WebClient webClient;

    public FundController(ChildrenService childrenService, ParentService parentService, FundService fundService, JWTUtil jwtUtil, JsonRequestUtil jsonRequestUtil, WebClient webClient) {
        this.childrenService = childrenService;
        this.parentService = parentService;
        this.fundService = fundService;
        this.jwtUtil = jwtUtil;
        this.jsonRequestUtil = jsonRequestUtil;
        this.webClient = webClient;
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
    public ResponseEntity<CommonResponseDto> requestWithdraw(
            @RequestHeader("Authorization") String token, 
            @RequestBody WithdrawDto amount
    ) {
        String userId = jwtUtil.getUsername(token);

        Children child = childrenService.findByUserId(userId);
        if(child.getMoney() < amount.getWithdrawableMoney()){
            throw new InvalidRequestException("요청한 금액이 머니 잔액보다 큽니다.");
        }else if(child.getWithdrawableMoney() < amount.getWithdrawableMoney()){
            throw new InvalidRequestException("요청한 금액이 출금 가능 금액보다 큽니다.");
        }else if(child.getAccountNumber() == null){
            throw new InvalidRequestException("계좌 등록 후 출금 요청이 가능합니다.");
        }
        
        System.out.println("🎈🎈🎈🎈");
        System.out.println(amount);
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
    @Transactional
    public ResponseEntity<CommonResponseDto> approveWithdrawalRequest(
            @RequestHeader("Authorization") String token,
            @RequestBody @Valid WithdrawalApproveDto approve
    ) {
        // 출금요청 승인: 부모 마니모 계좌에서 자식의 실계좌로 입금
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

        Children child = childrenService.findByUserId(approve.getChildrenId());
        if(child.getAccountNumber() == null){
            throw new InvalidRequestException("자식 계좌 등록 후 사용이 가능합니다.");
        }

        ObjectNode jsonObject = jsonRequestUtil.createRequestBody("updateDemandDepositAccountDeposit", approve.getUserKey());
        jsonObject.put("accountNo", child.getAccountNumber());
        jsonObject.put("transactionBalance", approve.getAmount());

        System.out.println("✨✨✨✨✨✨✨");
        System.out.println(jsonObject);
        try {
            String response = webClient.post()
                    .uri("/edu/demandDeposit/updateDemandDepositAccountDeposit")
                    .bodyValue(jsonObject)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("✨✨✨✨✨✨✨");
            System.out.println(response);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(CommonResponseDto.builder()
                            .stateCode(201)
                            .message("부모-출금요청 승인 성공")
                            .data(null)
                            .build());
        } catch (WebClientException e) {
            // API 호출 실패 시 롤백
            System.out.println(e);
            throw new InvalidRequestException("외부 API 호출 실패로 인한 롤백");
        }
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

    /**
     * 부모 - 머니 미지급 내역 조회
     * */
    @GetMapping("/nopaid")
    public ResponseEntity<CommonResponseDto> getNoPaidList(@RequestHeader("Authorization") String token) {
        String userId = jwtUtil.getUsername(token);
        if(!parentService.isExistByUserId(userId)){
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("용돈 미지급 내역 조회")
                        .data(fundService.findAllUnpaid(userId))
                        .build());
    }

    /**
     * 부모 - 용돈 지급
     * */
    @PutMapping("/giveMoney")
    public ResponseEntity<CommonResponseDto> giveAllowance(@RequestHeader("Authorization") String token, @RequestBody AllowancePaymentDto request){
        String userId = jwtUtil.getUsername(token);
        if(!parentService.isExistByUserId(userId)){
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        long result = fundService.updateAllowance(userId,request);
        if(result == 0){
            throw new InvalidRequestException("용돈 지급 실패"); //400
        }
        else {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(CommonResponseDto.builder()
                            .stateCode(201)
                            .message(request.getChildrenId() + " 한테  "+request.getAmount()+"머니 용돈 지급 성공")
                            .build());
        }

    }

    /**
     * 매월 1일 용돈 스케줄러 테스트용

    @PutMapping("/test")
    public ResponseEntity<CommonResponseDto> allowance(@RequestHeader("Authorization") String token) {
        fundService.updateAllowanceMonthly();

        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.builder()
                        .stateCode(200)
                        .message("용돈 지급 ")
                        .build());
    }
     */

}
