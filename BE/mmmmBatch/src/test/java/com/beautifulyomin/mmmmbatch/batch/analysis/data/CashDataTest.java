package com.beautifulyomin.mmmmbatch.batch.analysis.data;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.report.CashData;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

class CashDataTest {
    @Nested
    @DisplayName("getCashRatio 메소드는")
    class Describe_getCashRatio {

        @ParameterizedTest(name = "내 돈이 {0}, 평가금 총합이 {1}일 때, 현금 비율은 {2}이어야 한다.")
        @CsvSource({
                "0, 0, 0",
                "100, 0, 100",
                "50, 50, 50",
                "25, 75, 25",
                "10, 90, 10",
                "90, 10, 90"
        })
        void it_returns_correct_cash_ratio(int myMoney, int marketValueSum, int expectedRatio) {
            CashData cashData = new CashData(myMoney, marketValueSum);
            assertThat(cashData.calculateCashRatio()).isEqualTo(expectedRatio);
        }
    }

    @Nested
    @DisplayName("NotCashRatio 메소드는")
    class Describe_NotCashRatio {

        @ParameterizedTest(name = "내 돈이 {0}, 평가금 총합이 {1}일 때, 비현금 비율은 {2}이어야 한다.")
        @CsvSource({
                "0, 0, 0", //분석 대상이 아니면 공격적 성향도 0
                "100, 0, 0",
                "50, 50, 50",
                "25, 75, 75",
                "10, 90, 90",
                "90, 10, 10"
        })
        void it_returns_correct_not_cash_ratio(int myMoney, int marketValueSum, int expectedRatio) {
            CashData cashData = new CashData(myMoney, marketValueSum);
            assertThat(cashData.getNotCashRatio()).isEqualTo(expectedRatio);
        }

        @ParameterizedTest(name = "내 돈이 {0}, 평가금 총합이 {1}일 때, 현금 비율은 {2}이어야 한다.")
        @CsvSource({
                "0, 0, 0",
                "100, 0, 100",
                "50, 50, 50",
                "25, 75, 25",
                "10, 90, 10",
                "90, 10, 90"
        })
        void it_returns_correct_cash_ratio(int myMoney, int marketValueSum, int expectedRatio) {
            CashData cashData = new CashData(myMoney, marketValueSum);
            assertThat(cashData.calculateCashRatio()).isEqualTo(expectedRatio);
        }
    }
}