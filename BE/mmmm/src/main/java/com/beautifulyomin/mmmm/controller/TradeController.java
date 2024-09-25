package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import com.beautifulyomin.mmmm.domain.member.service.ParentService;
import com.beautifulyomin.mmmm.domain.stock.dto.ReasonBonusMoneyRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.service.TradeService;
import com.beautifulyomin.mmmm.exception.InvalidRequestException;
import com.beautifulyomin.mmmm.exception.InvalidRoleException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/stocks")
public class TradeController {

    private final TradeService tradeService;
    private final ParentService parentService;

    private final JWTUtil jwtUtil;

    public TradeController(TradeService tradeService, ParentService parentService, JWTUtil jwtUtil) {
        this.tradeService = tradeService;
        this.parentService = parentService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<CommonResponseDto> createTrade(@RequestHeader("Authorization") String token, @Valid @RequestBody TradeDto tradeDto) {
        String userId = jwtUtil.getUsername(token); // token 에서 userId를 받아온다. ( 아이디, 즉 이메일 )
        // 아이디로 child 테이블에 접근해서 childrenId를 받아온다. -> service에서 처리
        // userId 잘 넘어오는지 로그 확인
//        log.info("userId : ", userId);
        // 그 다음 tradeDto에 적용한다.
        tradeService.createTrade(tradeDto, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("거래 내역 생성 성공")
                        .build());
    }

    @PutMapping
    public ResponseEntity<CommonResponseDto> updateReasonBonusMoney(@RequestHeader("Authorization") String token, @Valid @RequestBody ReasonBonusMoneyRequestDto requestDto) {
        String userId = jwtUtil.getUsername(token);
        //토큰 유저가 부모가 아닐경우 401 리턴
        if(!parentService.isExistByUserId(userId)){
            throw new InvalidRoleException("부모가 아닙니다.");
        }


        int result = tradeService.updateReaseonBonusMoney(userId,requestDto);
        if(result == 0){
            throw new InvalidRequestException("이유보상머니 지급 실패");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("이유보상머니 지금 완료")
                        .build());


    }
}
