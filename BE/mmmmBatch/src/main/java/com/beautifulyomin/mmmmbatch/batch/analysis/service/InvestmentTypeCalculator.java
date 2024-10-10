package com.beautifulyomin.mmmmbatch.batch.analysis.service;

import com.beautifulyomin.mmmmbatch.batch.analysis.constant.InvestmentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.security.core.parameters.P;
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
    private int tradeCount;  // 월간 거래 횟수
    private int cashAmount;  // 월말 현금 보유량
    private BigDecimal stockValue;  // 월간 주식 보유 가치
    private BigDecimal realizedGains;  // 월간 실현 이익
    private BigDecimal realizedLosses;  // 월간 실현 손실
    private Integer monthlyStartMoney; //월간 시작 시드 머니

    public InvestmentType calculate() {
        if (monthlyStartMoney.equals(0)) {
            return InvestmentType.NONE;
        }

        double logCashAmount = getLogScaledValue(scaleValueToSeedMoney(BigDecimal.valueOf(cashAmount), monthlyStartMoney));
        double logStockValue = getLogScaledValue(scaleValueToSeedMoney(stockValue, monthlyStartMoney));
        double logRealizedGains = getLogScaledValue(scaleValueToSeedMoney(realizedGains, monthlyStartMoney));
        double logRealizedLosses = getLogScaledValue(scaleValueToSeedMoney(realizedLosses, monthlyStartMoney));

        if (logRealizedLosses <= 1.808) { //손실 적음
            if (logRealizedGains <= 1.494) { //수익 적음
                if (logCashAmount <= 0.988) { //현금 비중 적음
                    //2.0 안정적인 거래, 자산의 변동이 크지 않음, 리스크 피하는 투자자, 소극적 : 새싹
                    return InvestmentType.SPROUT;
                } else { //
                    //1.0 성과가 저조 손실 적음 수익 적음 : 느긋한 거북이
                    // 주로 거래 횟수도 많고 주식 수도 많음
                    return InvestmentType.TURTLE;
                }
            } else { //손실 적고 수익 많음
                //4.0  투자 잘함, 성과 좋은 투자자
                return InvestmentType.CHEETAH;
            }
        } else { //손실 많음
            if (logRealizedGains <= 1.57) { //수익은 적음
                if (logCashAmount <= 2.281) {
                    //1.0 투자 잘 못함 손실 적음 수익 적음 : 거북이
                    return InvestmentType.TURTLE;
                } else { //현금 비중 많음 
                    //3.0 보수적, 손실은 많지만 현금 비중이 많아서 위험 회피 성향으로 분류 : 바다코끼리
                    return InvestmentType.WALRUS;
                }
            } else { //손실 많고 수익 많음
                //5.0 그냥 막 해보는거야~~ 공격적인 투자자 : 불사조
                return InvestmentType.PHOENIX;
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
