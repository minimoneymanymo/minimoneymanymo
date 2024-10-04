package com.beautifulyomin.mmmmbatch.batch.analysis.step.cluster;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster.InvestorData;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReport;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.InvestmentAnalysisRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.*;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvestorClusterReader implements ItemReader<InvestmentReport> {
    private final InvestmentAnalysisRepository repository;
    private Iterator<InvestmentReport> reportIterator;

    @Override
    public InvestmentReport read() {
        if (reportIterator == null) {
            log.debug("🔥🔥🔥Initializing InvestorClusterReader");
            List<InvestmentReport> reports = repository.findAllByDate(LocalDate.now());
            reportIterator = reports.iterator();
            log.debug("🌠Found {} InvestmentReports", reports.size());
        }

        if (reportIterator.hasNext()) {
            InvestmentReport report = reportIterator.next();
            log.debug("🌠Reading InvestmentReport: childrenId={}, date={}", report.getChildrenId(), report.getDate());
            return report;
        }

        log.debug("🔥🔥🔥Finished reading all InvestmentReports");
        return null;
    }
}