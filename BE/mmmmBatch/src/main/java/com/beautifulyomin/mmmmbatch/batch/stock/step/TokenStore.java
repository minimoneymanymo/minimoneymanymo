package com.beautifulyomin.mmmmbatch.batch.stock.step;

import org.springframework.stereotype.Component;

@Component
public class TokenStore {
    String currentToken;
    public String getToken(){
        return currentToken;
    }
    public void saveToken(String token){
        this.currentToken=token;
    }
}
