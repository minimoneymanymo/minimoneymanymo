package com.beautifulyomin.mmmmbatch.batch.analysis.vo;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
class WinLossDataTest {

    @Nested
    @DisplayName("기본 테스트 :: calculateFinalScore 메소드는")
    class CalculateFinalScore {
        @Test
        @DisplayName("모든 거래가 이익이고 실현 수익률이 높을 때 100.00에 가까운 점수를 반환해야 한다")
        void test1() {
            WinLossData data = new WinLossData(10, 10, BigDecimal.valueOf(10000), BigDecimal.ZERO);
            BigDecimal score = data.calculateFinalScore();
            log.info("score = {}", score);
            assertThat(score).isGreaterThanOrEqualTo(new BigDecimal("95.00"))
                    .isLessThanOrEqualTo(new BigDecimal("100.00"));
        }

        @Test
        @DisplayName("승률이 50%이고 수익과 손실이 같을 때 50.00에 가까운 점수를 반환해야 한다")
        void test2() {
            WinLossData data = new WinLossData(5, 10, BigDecimal.valueOf(10000), BigDecimal.valueOf(10000));
            BigDecimal score = data.calculateFinalScore();
            log.info("score = {}", score);
            assertThat(score).isGreaterThanOrEqualTo(new BigDecimal("45.00"))
                    .isLessThanOrEqualTo(new BigDecimal("55.00"));
        }

        @Test
        @DisplayName("모든 거래가 손실이고 실현 수익률이 낮을 때 0.00에 가까운 점수를 반환해야 한다")
        void test3() {
            WinLossData data = new WinLossData(0, 10, BigDecimal.ZERO, BigDecimal.valueOf(10000));
            BigDecimal score = data.calculateFinalScore();
            log.info("score = {}", score);
            assertThat(score).isLessThan(new BigDecimal("5.00"))
                    .isGreaterThanOrEqualTo(BigDecimal.ZERO);
        }

        @Test
        @DisplayName("거래가 없을 때 0을 반환해야 한다.")
        void test4() {
            WinLossData data = new WinLossData(0, 0, BigDecimal.ZERO, BigDecimal.valueOf(0));
            BigDecimal score = data.calculateFinalScore();
            log.info("score = {}", score);
            assertThat(score).isEqualTo(BigDecimal.ZERO);
        }
    }

    @Nested
    @DisplayName("비교 테스트 :: calculateFinalScore 메소드는")
    class ComparisonTests {

        @Test
        @DisplayName("같은 실현 수익률을 가졌을 때 승률이 높은 쪽이 더 높은 점수를 가진다")
        void compareTest1() {
            WinLossData data1 = new WinLossData(4, 10, BigDecimal.valueOf(5000), BigDecimal.valueOf(10000));
            WinLossData data2 = new WinLossData(6, 10, BigDecimal.valueOf(5000), BigDecimal.valueOf(10000));

            BigDecimal score1 = data1.calculateFinalScore();
            BigDecimal score2 = data2.calculateFinalScore();
            log.info("score1 = {}", score1);
            log.info("score2 = {}", score2);

            assertThat(score2).isGreaterThan(score1);
        }

        @Test
        @DisplayName("거래 횟수와 금액이 달라도 승률과 실현 수익률 비율이 같으면 같은 점수를 가진다")
        void compareTest2() {
            WinLossData data1 = new WinLossData(6, 10, BigDecimal.valueOf(5000), BigDecimal.valueOf(10000));
            WinLossData data2 = new WinLossData(6, 10, BigDecimal.valueOf(500000), BigDecimal.valueOf(1000000));

            BigDecimal score1 = data1.calculateFinalScore();
            BigDecimal score2 = data2.calculateFinalScore();
            log.info("score1 = {}", score1);
            log.info("score2 = {}", score2);

            assertThat(score2).isEqualTo(score1);
        }
    }
}