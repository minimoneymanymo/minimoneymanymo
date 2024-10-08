package com.beautifulyomin.mmmmbatch.batch.analysis.step.report;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.report.*;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.RowReportValue;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.TradeRecord;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.Children;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReport;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.AnalysisRepositoryCustom;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.RowReportValueRepository;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.StocksHeldRepository;
import com.beautifulyomin.mmmmbatch.batch.analysis.service.InvestmentTypeCalculator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Component
public class InvestmentAnalysisProcessor implements ItemProcessor<Children, InvestmentReport> {

    private final AnalysisRepositoryCustom analysisRepositoryCustom;

    private static final LocalDate INV_DATE = LocalDate.now();
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final LocalDate START_DATE = INV_DATE.withDayOfMonth(1);
    private static final LocalDate END_DATE = INV_DATE;
    private final StocksHeldRepository stocksHeldRepository;
    private RowReportValueRepository rowReportValueRepository;

    private String START_DATE_STR;
    private String END_DATE_STR;


    @Autowired
    public InvestmentAnalysisProcessor(AnalysisRepositoryCustom analysisRepositoryCustom, StocksHeldRepository stocksHeldRepository, RowReportValueRepository rowReportValueRepository) {
        this.analysisRepositoryCustom = analysisRepositoryCustom;
        this.stocksHeldRepository = stocksHeldRepository;
        this.rowReportValueRepository = rowReportValueRepository;
    }

    @Override
    public InvestmentReport process(Children children) {
        START_DATE_STR = START_DATE.atStartOfDay().format(FORMATTER);
        END_DATE_STR = END_DATE.atStartOfDay().format(FORMATTER);

        log.debug("🔥🔥🔥InvestmentAnalysisProcessor");

        List<TradeRecord> tradeRecordList = getTradeRecords(children);
        int winTradeCount = getWinTradeCount(tradeRecordList);

        int cashAmount = getTotalAmountSumByChildrenId(children);
        BigDecimal realizedGains = getRealizedGains(tradeRecordList);
        BigDecimal realizedLosses = getRealizedLosses(tradeRecordList);
        BigDecimal stockValue = getStockValue(children);
        int tradeCount = calculateTradingFrequency(children);
        Integer monthlyStartMoney = getMonthlyStartMoney(children, START_DATE_STR); //월간 시작 시드 머니

        RowReportValue rowReportValue = new RowReportValue(children.getChildrenId(), END_DATE, tradeCount, cashAmount, stockValue, realizedGains, realizedLosses);
        InvestmentTypeCalculator investmentTypeCalculator = new InvestmentTypeCalculator(tradeCount, cashAmount, stockValue, realizedGains, realizedLosses, monthlyStartMoney);
        rowReportValueRepository.save(rowReportValue);

        InvestmentReport report = InvestmentReport.builder()
                .childrenId(children.getChildrenId())
                .date(INV_DATE)
                .cashRatio(calculateCashRatio(children, cashAmount))
                .diversification(calculateDiversification(children))
                .stability(calculateStability(children))
                .tradingFrequency(calculateTradingFrequency(children))
                .winLossRatio(calculateWinLossRatio(tradeRecordList, winTradeCount))
                .investmentType(investmentTypeCalculator.calculate().getLabel())
                .build();

        return report;
    }

    private Integer getMonthlyStartMoney(Children children, String startDateStr) {
        return analysisRepositoryCustom.getMonthlyStartMoney(children.getChildrenId(), startDateStr);
    }

    /**
     * @return 월말 기준 보유 종목의 안정성 점수 (코스피, 코스닥 등 시장 유형 기반)
     */
    private Integer calculateStability(Children children) {
        List<String> marketTypesOfHeldStock = analysisRepositoryCustom
                .findAllMarketTypeByChildrenId(children.getChildrenId(), START_DATE_STR, END_DATE_STR);
        return new StabilityData(marketTypesOfHeldStock).calculateScore();
    }

    /**
     * @return 월말 기준 보유 종목 수에 따른 분산 투자 점수
     */
    private Integer calculateDiversification(Children children) {
        List<String> uniqueStocksHeld = analysisRepositoryCustom
                .findAllMarketTypeByChildrenId(children.getChildrenId(), START_DATE_STR, END_DATE_STR);
        return new DiversificationData(uniqueStocksHeld.size()).calculateScore();
    }

    /**
     * @return 월별 손익 비율
     */
    private BigDecimal calculateWinLossRatio(List<TradeRecord> tradeRecordList, int winTradeCount) {
        int totalTradeCount = tradeRecordList.size();
        BigDecimal realizedGains = getRealizedGains(tradeRecordList);
        BigDecimal realizedLosses = getRealizedLosses(tradeRecordList);

        WinLossData
                winLossData = new WinLossData(winTradeCount, totalTradeCount, realizedGains, realizedLosses);
        return winLossData.calculateFinalScore();
    }

    /**
     * @return 월말 기준 보유하고 있는 현금 -> 현금 비율 (애매하면 빼자)
     */
    private BigDecimal calculateCashRatio(Children children, int cashAmount) {
        CashData cashData = new CashData(children.getMoney(), cashAmount);
        return BigDecimal.valueOf(cashData.calculateCashRatio()).setScale(2, RoundingMode.HALF_UP);
    }

    private int getTotalAmountSumByChildrenId(Children children) {
        return analysisRepositoryCustom.getTotalAmountSumByChildrenId(children.getChildrenId());
    }


    /**
     * @return 월별 매매 횟수(유동성)
     */
    private int calculateTradingFrequency(Children children) {
        return new TradingFrequencyData(analysisRepositoryCustom
                .countTradesByChildrenIdAndDateRange(children.getChildrenId(), START_DATE_STR, END_DATE_STR))
                .calculateScore();
    }


    private BigDecimal getRealizedGains(List<TradeRecord> tradeRecordList) {
        return tradeRecordList.stream()
                .map(TradeRecord::getStockTradingGain)
                .filter(stockTradingGain -> stockTradingGain.compareTo(BigDecimal.ZERO) > 0)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getRealizedLosses(List<TradeRecord> tradeRecordList) {
        return tradeRecordList.stream()
                .map(TradeRecord::getStockTradingGain)
                .filter(stockTradingGain -> stockTradingGain.compareTo(BigDecimal.ZERO) < 0)
                .map(BigDecimal::negate) //음수 값들을 양수로 변환
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getStockValue(Children children) {
        return analysisRepositoryCustom.getRemainSharesCountSum(children.getChildrenId());
    }

    private List<TradeRecord> getTradeRecords(Children children) {
        return analysisRepositoryCustom
                .getTradeRecordsByDateRange(children.getChildrenId(), START_DATE_STR, END_DATE_STR);
    }

    private static int getWinTradeCount(List<TradeRecord> tradeRecordList) {
        return (int) tradeRecordList.stream()
                .filter(tradeRecord -> tradeRecord.getStockTradingGain().compareTo(BigDecimal.ZERO) > 0)
                .count();
    }


}
