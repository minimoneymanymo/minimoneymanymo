package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.service.TradeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stocks")
public class TradeController {

    private final TradeService tradeService;
    private final JWTUtil jwtUtil;

    public TradeController(TradeService tradeService, JWTUtil jwtUtil) {
        this.tradeService = tradeService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<CommonResponseDto> createTrade(@RequestHeader("Authorization") String token, @RequestBody TradeDto tradeDto) {
        String userId = jwtUtil.getUsername(token); // token 에서 userId를 받아온다. ( 아이디, 즉 이메일 )
        // 아이디로 child 테이블에 접근해서 childrenId를 받아온다. -> service에서 처리

        // 그 다음 tradeDto에 적용한다.
        tradeService.createTrade(tradeDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.builder()
                        .stateCode(201)
                        .message("거래 내역 생성 성공")
                        .build());
    }
}
