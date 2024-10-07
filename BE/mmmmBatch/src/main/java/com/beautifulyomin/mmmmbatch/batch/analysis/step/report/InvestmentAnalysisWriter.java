package com.beautifulyomin.mmmmbatch.batch.analysis.step.report;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReport;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReportV2;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.MonthlyInvestorStatistics;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.InvestmentAnalysisRepository;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.InvestmentAnalysisRepositoryV2;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.MonthlyInvestorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvestmentAnalysisWriter implements ItemWriter<InvestmentReport> {

    private final InvestmentAnalysisRepository investmentAnalysisRepository;

    @Override
    public void write(Chunk<? extends InvestmentReport> item) {
        log.info("🔥🔥🔥InvestmentAnalysisWriter");
        investmentAnalysisRepository.saveAll(item);
    }
}
