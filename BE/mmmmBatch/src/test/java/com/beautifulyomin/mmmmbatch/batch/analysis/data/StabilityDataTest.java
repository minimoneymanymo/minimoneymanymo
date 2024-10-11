package com.beautifulyomin.mmmmbatch.batch.analysis.data;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.report.StabilityData;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.*;
import java.util.stream.Stream;


class StabilityDataTest {
    @ParameterizedTest
    @MethodSource("provideMarketTypeLists")
    @DisplayName("StabilityData 점수 계산 테스트")
    void testCalculateScore(List<String> marketTypes, int expectedScore){
        StabilityData stabilityData = new StabilityData(marketTypes);
        Assertions.assertThat(stabilityData.calculateScore()).isEqualTo(expectedScore);
    }

    private static Stream<Arguments> provideMarketTypeLists() {
        return Stream.of(
                org.junit.jupiter.params.provider.Arguments.of(List.of("KOSPI", "KOSPI200"), 90), // 평균 점수 90
                org.junit.jupiter.params.provider.Arguments.of(List.of("KOSDAQ", "KONEX"), 30),   // 평균 점수 30
                org.junit.jupiter.params.provider.Arguments.of(List.of("KSQ150"), 60),            // 단일 종목 점수 60
                org.junit.jupiter.params.provider.Arguments.of(List.of(), 0)                      // 빈 리스트일 때 0
        );
    }
}