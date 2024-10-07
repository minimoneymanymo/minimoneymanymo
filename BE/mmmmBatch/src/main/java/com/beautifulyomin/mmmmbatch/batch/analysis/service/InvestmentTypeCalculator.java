package com.beautifulyomin.mmmmbatch.batch.analysis.service;

import com.beautifulyomin.mmmmbatch.batch.analysis.constant.InvestmentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@ToString
@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Service
public class InvestmentTypeCalculator {

    //모델 학습에 사용된 5개 지표
    private Long tradeCount;  // 월간 거래 횟수
    private BigDecimal cashAmount;  // 월말 현금 보유량
    private BigDecimal stockValue;  // 월간 주식 보유 가치
    private BigDecimal realizedGains;  // 월간 실현 이익
    private BigDecimal realizedLosses;  // 월간 실현 손실
    private Integer monthlyStartMoney; //월간 시작 시드 머니

    public InvestmentType calculate() {
        if(monthlyStartMoney.equals(0)){
            return InvestmentType.NONE;
        }

        double logCashAmount = getLogScaledValue(scaleValueToSeedMoney(cashAmount, monthlyStartMoney));
        double logStockValue = getLogScaledValue(scaleValueToSeedMoney(stockValue, monthlyStartMoney));
        double logRealizedGains = getLogScaledValue(scaleValueToSeedMoney(realizedGains, monthlyStartMoney));
        double logRealizedLosses = getLogScaledValue(scaleValueToSeedMoney(realizedLosses, monthlyStartMoney));

        if (logRealizedGains <= 1.343) {
            if (logRealizedLosses <= 4.361) {
                if (logStockValue <= 11.513) {
                    return InvestmentType.TURTLE;
                }
                return InvestmentType.SPROUT;
            } else {
                if (logCashAmount <= 3.238) {
                    return InvestmentType.LION;
                }
                return InvestmentType.TURTLE;
            }
        } else {
            if (logRealizedLosses <= 4.295) {
                return InvestmentType.TURTLE;
            } else {
                if (logCashAmount <= 0.5) {
                    return InvestmentType.PHONEIX;
                }
                return InvestmentType.TURTLE;
            }
        }
    }

    private double getLogScaledValue(double value) {
        if (value <= 0) {
            return 0;
        }
        return Math.log10(value);
    }

    private double scaleValueToSeedMoney(BigDecimal value, Integer seedMoney) {
        BigDecimal scaleFactor = BigDecimal.valueOf(100000).divide(BigDecimal.valueOf(seedMoney), RoundingMode.HALF_UP);
        return value.multiply(scaleFactor).doubleValue();
    }

}
