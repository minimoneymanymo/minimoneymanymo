package com.beautifulyomin.mmmm;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class MmmmApplicationTests {

    @BeforeAll
    static void setUp() {  //모든 메서드 실행 전 딱 한 번
        Dotenv dotenv = Dotenv.configure().load();
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );
    }

    @Test
    void contextLoads() {
    }

}
