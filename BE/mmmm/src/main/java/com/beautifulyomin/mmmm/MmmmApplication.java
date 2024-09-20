package com.beautifulyomin.mmmm;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Arrays;

@SpringBootApplication
@EnableScheduling
public class MmmmApplication {
    @Value("${SPRING_PROFILES_ACTIVE : devlop}")
    private static String env;

    public static void main(String[] args) {

        if (!env.equals("prod")) {
            Dotenv dotenv = Dotenv.configure().load();
            dotenv.entries().forEach(entry ->
                    System.setProperty(entry.getKey(), entry.getValue())
            );
        }


        SpringApplication.run(MmmmApplication.class, args);
    }

}
