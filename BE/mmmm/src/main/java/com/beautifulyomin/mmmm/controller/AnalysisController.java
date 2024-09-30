package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.common.jwt.JWTUtil;
import com.beautifulyomin.mmmm.domain.analysis.service.AnalysisService;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildDto;
import com.beautifulyomin.mmmm.domain.member.service.ParentService;
import com.beautifulyomin.mmmm.exception.InvalidRoleException;
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
    private final ParentService parentService;
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


    @GetMapping("/report/child/{childrenId}")
    public ResponseEntity<CommonResponseDto> getStockDetail(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable(name = "childrenId") int childrenId) {
        String userId = jwtUtil.getUsername(token);
        if (!parentService.isExistByUserId(userId)) {
            throw new InvalidRoleException("부모가 아닙니다.");
        }
        MyChildDto myChild = parentService.getMyChild(userId, childrenId);
        if (myChild == null) {
            throw new IllegalArgumentException(childrenId + "의 자식이 존재하지 않습니다.");
        }
        return ResponseEntity.ok(CommonResponseDto.builder()
                .stateCode(200)
                .message("자식의 통계 조회 성공!")
                .data(analysisService.getAnalysisReport(myChild.getUserId()))
                .build());
    }

}
