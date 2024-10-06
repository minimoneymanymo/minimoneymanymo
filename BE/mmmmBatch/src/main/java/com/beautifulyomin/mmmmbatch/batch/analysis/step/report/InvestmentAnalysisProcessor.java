package com.beautifulyomin.mmmmbatch.batch.analysis.step.report;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.report.*;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.TradeRecord;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.ChildrenRepository;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.Children;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReport;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.AnalysisRepositoryCustom;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.StocksHeldRepository;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.TradeRecordRepository;
import com.beautifulyomin.mmmmbatch.batch.stock.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvestmentAnalysisProcessor implements ItemProcessor<Children, InvestmentReport> {
    private final AnalysisRepositoryCustom analysisRepositoryCustom;

    //    private static final LocalDate INV_DATE = LocalDate.now();
    private static final LocalDate INV_DATE = LocalDate.of(2024, 9, 30);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final LocalDate START_DATE = INV_DATE.withDayOfMonth(1);
    private static final LocalDate END_DATE = INV_DATE;
    @Override
    public InvestmentReport process(Children children) {
        log.debug("🔥🔥🔥InvestmentAnalysisProcessor");
        InvestmentReport report = InvestmentReport.builder()
                .childrenId(children.getChildrenId())
                .date(INV_DATE)
                .cashRatio(calculateCashRatio(children))
                .diversification(calculateDiversification(children))
                .stability(calculateStability(children))
                .tradingFrequency(calculateTradingFrequency(children))
                .winLossRatio(calculateWinLossRatio(children))
                .build();

        log.info("🌠🌠🌠report={}", report);
        return report;
    }

    /**
     * @return 월말 기준 보유 종목의 안정성 점수 (코스피, 코스닥 등 시장 유형 기반)
     */
    private Integer calculateStability(Children children) {
        List<String> marketTypesOfHeldStock = analysisRepositoryCustom.findAllMarketTypeByChildrenId(
                children.getChildrenId());
        return new StabilityData(marketTypesOfHeldStock).calculateScore();
    }

    /**
     * @return 월말 기준 보유 종목 수에 따른 분산 투자 점수
     */
    private Integer calculateDiversification(Children children) {
        List<String> uniqueStocksHeld = analysisRepositoryCustom.findAllMarketTypeByChildrenId(
                children.getChildrenId());
        return new DiversificationData(uniqueStocksHeld.size()).calculateScore();
    }

    /**
     * @return 월별 손익 비율
     */
    private BigDecimal calculateWinLossRatio(Children children) {
        String startDate = START_DATE.atStartOfDay().format(FORMATTER);
        String endDate = END_DATE.atStartOfDay().format(FORMATTER);

        //기간별 거래 내역 불러오기
        List<TradeRecord> tradeRecordList = analysisRepositoryCustom.getTradeRecordsByDateRange(children.getChildrenId(), startDate, endDate);

        //수익낸 거래수
        int winTradeCount = (int) tradeRecordList.stream()
                .filter(tradeRecord -> tradeRecord.getStockTradingGain().compareTo(BigDecimal.ZERO) > 0)
                .count();

        //전체 거래수
        int totalTradeCount = tradeRecordList.size();

        //실현된 이익 (TradingRecord의 손익 머니가 양수)
        BigDecimal realizedGains = tradeRecordList.stream()
                .map(TradeRecord::getStockTradingGain)
                .filter(stockTradingGain -> stockTradingGain.compareTo(BigDecimal.ZERO) > 0)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        //실현된 손실 (TradingRecord의 손익 머니가 음수)
        BigDecimal realizedLosses = tradeRecordList.stream()
                .map(TradeRecord::getStockTradingGain)
                .filter(stockTradingGain -> stockTradingGain.compareTo(BigDecimal.ZERO) < 0)
                .map(BigDecimal::negate) //음수 값들을 양수로 변환
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        WinLossData winLossData = new WinLossData(winTradeCount, totalTradeCount, realizedGains, realizedLosses);
        return winLossData.calculateFinalScore();
    }

    /**
     * @return 월말 기준 보유하고 있는 현금 -> 현금 비율 (애매하면 빼자)
     */
    private BigDecimal calculateCashRatio(Children children) {
        int totalHoldingMarketAmount = analysisRepositoryCustom.getTotalAmountSumByChildrenId(children.getChildrenId());
        CashData cashData = new CashData(children.getMoney(), totalHoldingMarketAmount);
        return BigDecimal.valueOf(cashData.calculateCashRatio()).setScale(2, RoundingMode.HALF_UP);
    }


    /**
     * @return 월별 매매 횟수(유동성)
     */
    private int calculateTradingFrequency(Children children) {
        String startDate = START_DATE.atStartOfDay().format(FORMATTER);
        String endDate = END_DATE.atStartOfDay().format(FORMATTER);
        TradingFrequencyData tradingFrequencyData = new TradingFrequencyData(
                analysisRepositoryCustom.countTradesByChildrenIdAndDateRange(children.getChildrenId(), startDate, endDate)
        );
        return tradingFrequencyData.calculateScore();
    }

}
