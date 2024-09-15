package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.naming.AuthenticationException;
import java.nio.file.AccessDeniedException;
import java.util.stream.Collectors;

@ControllerAdvice(basePackages = "com.beautifulyomin.mmmm")
public class ExceptionController {

    // 클라이언트 요청 에러(Bad Request) - 요청 데이터 형식이 올바르지 않거나 필수 파라미터가 누락된 경우
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonResponseDto> handleValidationException(MethodArgumentNotValidException ex) {
        // 유효성 검증 실패 시, 구체적인 에러 메시지 생성
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .collect(Collectors.joining(", "));

        CommonResponseDto errorResponse = new CommonResponseDto(400, errorMessage, null);
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }


    //인증 에러
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<CommonResponseDto> handleAuthenticationException(AuthenticationException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(401, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    //클라이언트 권한이 없는 경우
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<CommonResponseDto> handleAccessDeniedException(AccessDeniedException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(403, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    //서버 에러
    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponseDto> handleGenericException(Exception ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(500, "서버 오류: " + ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
