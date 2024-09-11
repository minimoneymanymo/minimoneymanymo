package com.beautifulyomin.mmmm.common.jwt;

import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.entity.Parent;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private CustomUserDetailsService customUserDetailsService;

    public JWTFilter(JWTUtil jwtUtil, CustomUserDetailsService customUserDetailsService) {
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;

    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //request에서 Authorization 헤더를 찾음
        String authorization = request.getHeader("Authorization");

        //Authorization 헤더 검증
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        System.out.println(authorization);
        System.out.println(authorization);
        System.out.println(authorization);
        String token = authorization.split(" ")[1];
        System.out.println(token);
        System.out.println(token);
        System.out.println(token);

        //토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        //토큰에서 username과 role 획득
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        CustomUserDetails customUserDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsernameAndRole(username, role);



        //스프링 시큐리티 인증 토큰 생성 (권한을 전달)
        Authentication authToken = new CustomAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities(), role);

        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }

}
