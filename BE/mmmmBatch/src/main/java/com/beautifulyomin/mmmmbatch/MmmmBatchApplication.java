package com.beautifulyomin.mmmmbatch;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Arrays;

@SpringBootApplication
@EnableBatchProcessing
@EnableScheduling
public class MmmmBatchApplication {

    public static void main(String[] args) {
        if (!Arrays.asList(args).contains("prod")) {
            Dotenv dotenv = Dotenv.configure().load();
            dotenv.entries().forEach(entry ->
                    System.setProperty(entry.getKey(), entry.getValue())
            );
        }
        SpringApplication.run(MmmmBatchApplication.class, args);
    }
}
