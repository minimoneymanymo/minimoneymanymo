package com.beautifulyomin.mmmm.common.jwt;

import com.beautifulyomin.mmmm.member.entity.Children;
import com.beautifulyomin.mmmm.member.entity.Parent;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private String username;
    private String password;
    private String role;

    // Parent 또는 Children에 따라 정보를 받아 처리
    public CustomUserDetails(Parent parent) {
        this.username = parent.getUserId();
        this.password = parent.getPassword();
        this.role = "0"; // 부모 역할
    }

    public CustomUserDetails(Children children) {
        this.username = children.getUserId();
        this.password = children.getPassword();
        this.role = "1"; // 자녀 역할
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
