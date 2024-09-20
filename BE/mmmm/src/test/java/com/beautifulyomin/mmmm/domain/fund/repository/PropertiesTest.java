package com.beautifulyomin.mmmm.domain.fund.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
public class PropertiesTest {

    @Autowired
    private Environment environment;


    @Test
    @DisplayName("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    void findAllMoneyRecordsByIdFailureTest() {
        System.out.println("DB URL: " + environment.getProperty("spring.datasource.url"));
        System.out.println("DB User: " + environment.getProperty("spring.datasource.username"));
        System.out.println("DB Password: " + environment.getProperty("spring.datasource.password"));
        System.out.println("DB URL: " + environment.getProperty("spring.datasource.url"));
        System.out.println("DB User: " + environment.getProperty("spring.datasource.username"));
        System.out.println("DB Password: " + environment.getProperty("spring.datasource.password"));

    }
}
