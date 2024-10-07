package com.beautifulyomin.mmmm;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Arrays;

@SpringBootApplication
@EnableScheduling
@EnableCaching
public class MmmmApplication {

    public static void main(String[] args) {
        if (!Arrays.asList(args).contains("prod")) {
            Dotenv dotenv = Dotenv.configure().load();
            dotenv.entries().forEach(entry ->
                    System.setProperty(entry.getKey(), entry.getValue())
            );
        }


        SpringApplication.run(MmmmApplication.class, args);
    }

}
