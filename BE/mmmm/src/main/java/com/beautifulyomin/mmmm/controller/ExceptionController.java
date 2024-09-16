package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.domain.stock.exception.StockNotFountException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.naming.AuthenticationException;
import java.nio.file.AccessDeniedException;

@ControllerAdvice(basePackages = "com.beautifulyomin.mmmm")
public class ExceptionController {

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<CommonResponseDto> handleAccessDeniedException(AccessDeniedException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(403, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<CommonResponseDto> handleAuthenticationException(AuthenticationException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(401, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler({StockNotFountException.class})
    public ResponseEntity<CommonResponseDto> handleNotFountException(RuntimeException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(404, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponseDto> handleGenericException(Exception ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(500, "서버 오류: " + ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
