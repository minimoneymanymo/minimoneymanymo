package com.beautifulyomin.mmmm.common.jwt;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken {

    private String role;

    // Constructor for creating token before authentication (credentials not yet verified)
    public CustomAuthenticationToken(Object principal, Object credentials, String role) {
        super(principal, credentials);
        this.role = role;
    }

    // Constructor for creating token after authentication (credentials verified)
    public CustomAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities, String role) {
        super(principal, credentials, authorities);
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
