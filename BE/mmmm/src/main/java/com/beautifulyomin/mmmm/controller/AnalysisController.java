package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.analysis.service.AnalysisService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@Validated
@AllArgsConstructor
@RequestMapping("/analysis")
public class AnalysisController {

    private final AnalysisService analysisService;
    private final JWTUtil jwtUtil;

    @GetMapping("/report")
    public ResponseEntity<CommonResponseDto> getStockDetail(
            @RequestHeader(value = "Authorization", required = false) String token) {
        String userId = jwtUtil.getUsername(token);
        return ResponseEntity.ok(CommonResponseDto.builder()
                .stateCode(200)
                .message("나의 통계 조회 성공!")
                .data(analysisService.getAnalysisReport(userId))
                .build());
    }

}
