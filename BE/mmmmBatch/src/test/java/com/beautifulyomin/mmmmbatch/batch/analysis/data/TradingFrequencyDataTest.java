package com.beautifulyomin.mmmmbatch.batch.analysis.data;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.report.TradingFrequencyData;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;


class TradingFrequencyDataTest {
    @Nested
    @DisplayName("calculateScore 메소드는 ")
    class Describe_getScore {

        //경계값 테스트
        @ParameterizedTest(name = "거래 횟수가 {0}일 때, 점수는 {1}이어야 한다.")
        @CsvSource({
                "0, 0",
                "4, 10",
                "5, 20",
                "14, 20",
                "15, 40",
                "29, 40",
                "30, 60",
                "49, 60",
                "50, 80",
                "74, 80",
                "75, 100",
                "100, 100",
                "1000, 100"
        })
        void it_returns_correct_score(long tradingCount, int expectedScore) {
            TradingFrequencyData data = new TradingFrequencyData(tradingCount);
            assertThat(data.calculateScore()).isEqualTo(expectedScore);
        }
    }

}