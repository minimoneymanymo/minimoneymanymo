package com.beautifulyomin.mmmmbatch.batch.analysis.data.report;

import lombok.AllArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
@ToString
@AllArgsConstructor
public class WinLossData {
    private int winTradeCount; // 수익 낸 거래 수
    private int totalTradeCount; // 전체 거래 수
    private BigDecimal realizedGains; // 실현된 이익
    private BigDecimal realizedLosses; // 실현된 손실

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final int SCALE = 2;
    private static final BigDecimal WIN_RATE_WEIGHT = BigDecimal.valueOf(0.6); //승률에 대한 가중치
    private static final BigDecimal REALIZED_RETURN_WEIGHT = BigDecimal.valueOf(0.4); //실현 수익률에 대한 가중치

    // 최종 점수 계산
    public BigDecimal calculateFinalScore() {
        if (this.totalTradeCount == 0) { //분석 대상 x
            return BigDecimal.ZERO;
        }
        BigDecimal winRate = calculateWinRate();
        BigDecimal realizedReturnRate = calculateRealizedReturnRate();

        log.info("winRate = {}",winRate);
        log.info("realizedReturnRate = {}",realizedReturnRate);

        return winRate.multiply(WIN_RATE_WEIGHT)
                .add(realizedReturnRate.multiply(REALIZED_RETURN_WEIGHT))
                .multiply(HUNDRED)
                .setScale(SCALE, RoundingMode.HALF_UP);
    }

    // 승률 계산
    private BigDecimal calculateWinRate() {
        if (totalTradeCount == 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(winTradeCount)
                .divide(BigDecimal.valueOf(totalTradeCount), SCALE, RoundingMode.HALF_UP);
    }

    // 실현 손익률 계산
    private BigDecimal calculateRealizedReturnRate() {
        BigDecimal totalTraded = realizedGains.add(realizedLosses);
        if (totalTraded.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal returnRate = realizedGains.subtract(realizedLosses)
                .divide(totalTraded, 4, RoundingMode.HALF_UP);
        return normalizeReturnRate(returnRate);
    }

    // 실현 수익률 0~1 값으로 정규화
    private BigDecimal normalizeReturnRate(BigDecimal returnRate) {
        // 시그모이드 함수를 사용한 정규화
        double sigmoid = 1 / (1 + Math.exp(-returnRate.doubleValue() * 5)); // *5는 시그모이드 곡선의 기울기 조정
        return BigDecimal.valueOf(sigmoid).setScale(SCALE, RoundingMode.HALF_UP);
    }
}
