package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.dto.CommonResponseDto;
import com.beautifulyomin.mmmm.domain.stock.exception.InvalidFilterTypeException;
import com.beautifulyomin.mmmm.domain.stock.exception.StockNotFoundException;
import com.beautifulyomin.mmmm.exception.InvalidRequestException;
import com.beautifulyomin.mmmm.exception.InvalidRoleException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.naming.AuthenticationException;
import java.nio.file.AccessDeniedException;

@ControllerAdvice(basePackages = "com.beautifulyomin.mmmm")
public class ExceptionController {

    @ExceptionHandler({BadRequestException.class, InvalidRequestException.class})
    public ResponseEntity<CommonResponseDto> handleBadRequestException(BadRequestException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(400, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({InvalidRoleException.class, AuthenticationException.class})
    public ResponseEntity<CommonResponseDto> handleAuthenticationException(Exception ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(401, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<CommonResponseDto> handleAccessDeniedException(AccessDeniedException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(403, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({StockNotFoundException.class, ConstraintViolationException.class, InvalidFilterTypeException.class
            , EntityNotFoundException.class})
    public ResponseEntity<CommonResponseDto> handleNotFountException(RuntimeException ex) {
        CommonResponseDto errorResponse = new CommonResponseDto(404, ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponseDto> handleGenericException(Exception ex) {
        ex.printStackTrace();
        CommonResponseDto errorResponse = new CommonResponseDto(500, "서버 오류: " + ex.getMessage(), null);
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
