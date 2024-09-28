package com.beautifulyomin.mmmmbatch.batch.analysis.step;

import com.beautifulyomin.mmmmbatch.batch.analysis.dto.TradingFrequencyData;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.Children;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReport;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.AnalysisCustom;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.StocksHeldRepository;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.TradeRecordRepository;
import com.beautifulyomin.mmmmbatch.batch.stock.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvestmentAnalysisProcessor implements ItemProcessor<Children, InvestmentReport> {
    private final AnalysisCustom analysisCustom;
    private final TradeRecordRepository tradeRecordRepository;
    private final StocksHeldRepository stocksHeldRepository;
    private final StockRepository stockRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");


    @Override
    public InvestmentReport process(Children children) {
        log.info("🔥🔥🔥InvestmentAnalysisProcessor");
        InvestmentReport report = new InvestmentReport();
        report.setChildrenId(children.getChildrenId());
        report.setDate(LocalDate.now());

        // 2. 거래 빈도 계산
        report.setTradingFrequency(calculateTradingFrequency(children));

        // 3-4. 현금 비중 및 비현금 비중 계산
        report.setNotCashRatio(BigDecimal.valueOf(0));

        // 5-6. 승률 및 손익 비율 계산
        report.setWinLossRatio(BigDecimal.valueOf(0));

        // 7. 다양성 점수 계산
        report.setDiversification(BigDecimal.valueOf(0));

        // 8. 안정성 점수 계산
        report.setStability(0);

        log.info("🌠🌠🌠report={}", report);
        return report;
    }

    private int calculateTradingFrequency(Children children) {
        String startDate = LocalDateTime.now().minusMonths(1).withDayOfMonth(1).format(FORMATTER);
        String endDate = LocalDateTime.now().withDayOfMonth(1).format(FORMATTER);
        TradingFrequencyData tradingFrequencyData = new TradingFrequencyData(
                analysisCustom.countTradesByChildrenIdAndDateRange(children.getChildrenId(), startDate, endDate)
        );
        return tradingFrequencyData.getScore();
    }

}
