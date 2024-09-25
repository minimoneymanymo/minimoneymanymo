package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.service.TradeService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/stocks")
@Validated // 추가: 클래스 레벨에서 유효성 검사를 활성화
public class TradeController {

    private final TradeService tradeService;
    private final JWTUtil jwtUtil;

    public TradeController(TradeService tradeService, JWTUtil jwtUtil) {
        this.tradeService = tradeService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<CommonResponseDto> createTrade(@Valid @RequestHeader("Authorization") String token, @Valid @RequestBody TradeDto tradeDto) {
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
}
