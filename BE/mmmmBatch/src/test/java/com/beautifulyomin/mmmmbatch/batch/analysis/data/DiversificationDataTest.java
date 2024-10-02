package com.beautifulyomin.mmmmbatch.batch.analysis.data;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.report.DiversificationData;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

class DiversificationDataTest {
    @Nested
    @DisplayName("calculateScore 메소드는 ")
    class Describe_getScore {

        //경계값 테스트
        @ParameterizedTest(name = "거래 횟수가 {0}일 때, 점수는 {1}이어야 한다.")
        @CsvSource({
                "0, 0",
                "1, 10",
                "2, 20",
                "4, 40",
                "10, 100",
                "15, 100"
        })
        void it_returns_correct_score(int stockHeldCount, int expectedScore) {
            DiversificationData data = new DiversificationData(stockHeldCount);
            assertThat(data.calculateScore()).isEqualTo(expectedScore);
        }
    }
}