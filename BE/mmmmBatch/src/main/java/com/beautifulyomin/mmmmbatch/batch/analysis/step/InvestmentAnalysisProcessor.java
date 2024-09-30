package com.beautifulyomin.mmmmbatch.batch.analysis.step;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.TradeRecord;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.ChildrenRepository;
import com.beautifulyomin.mmmmbatch.batch.analysis.vo.*;
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

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvestmentAnalysisProcessor implements ItemProcessor<Children, InvestmentReport> {
    private final AnalysisRepositoryCustom analysisRepositoryCustom;
    private final TradeRecordRepository tradeRecordRepository;
    private final StocksHeldRepository stocksHeldRepository;
    private final StockRepository stockRepository;
    private final ChildrenRepository childrenRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");


    @Override
    public InvestmentReport process(Children children) {
        log.debug("🔥🔥🔥InvestmentAnalysisProcessor");
        InvestmentReport report = InvestmentReport.builder()
                .childrenId(children.getChildrenId())
                .date(LocalDate.now())
                .cashRatio(calculateCashRatio(children))
                .diversification(calculateStockHeldCount(children))
                .stability(calculateStability(children))
                .tradingFrequency(calculateTradingFrequency(children))
                .winLossRatio(calculateWinLossRatio(children))
                .build();

        log.info("🌠🌠🌠report={}", report);
        return report;
    }

    private Integer calculateStability(Children children) {
        List<String> marketTypesOfHeldStock = analysisRepositoryCustom.findAllMarketTypeByChildrenId(children.getChildrenId());
        return new StabilityData(marketTypesOfHeldStock).calculateScore();
    }

    /**
     * @return 일간 분산 투자 비율
     */
    private Integer calculateStockHeldCount(Children children) {
        int stockHeldCount = stocksHeldRepository.countByChildren_ChildrenId(children.getChildrenId());
        return new DiversificationData(stockHeldCount).calculateScore();
    }

    /**
     * @return 주별 손익 비율
     */
    private BigDecimal calculateWinLossRatio(Children children) {
        String startDate = LocalDateTime.now().minusWeeks(1).with(DayOfWeek.MONDAY).format(FORMATTER);
        String endDate = LocalDateTime.now().minusWeeks(1).with(DayOfWeek.SUNDAY).format(FORMATTER);

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
     * @return 일별 현금 비율
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
        String startDate = LocalDateTime.now().minusMonths(1).withDayOfMonth(1).format(FORMATTER);
        String endDate = LocalDateTime.now().withDayOfMonth(1).format(FORMATTER);
        TradingFrequencyData tradingFrequencyData = new TradingFrequencyData(
                analysisRepositoryCustom.countTradesByChildrenIdAndDateRange(children.getChildrenId(), startDate, endDate)
        );
        return tradingFrequencyData.calculateScore();
    }

}
