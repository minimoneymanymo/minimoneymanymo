package com.beautifulyomin.mmmm.domain.analysis.service;

import com.beautifulyomin.mmmm.domain.analysis.dto.response.InvestmentReportDto;
import com.beautifulyomin.mmmm.domain.analysis.entity.QInvestmentReport;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
@AllArgsConstructor
public class AnalysisRepositoryCustomImpl implements AnalysisRepositoryCustom {
    private final JPAQueryFactory queryFactory;
    private final QInvestmentReport investmentReport = QInvestmentReport.investmentReport;

    @Override
    public LocalDate findLatestDate() {
        return queryFactory.select(investmentReport.date)
                .from(investmentReport)
                .orderBy(investmentReport.date.desc())
                .limit(1)
                .fetchOne();
    }

    @Override
    public InvestmentReportDto overallStatisticsByDate(LocalDate latestDate) {
        return queryFactory.select(Projections.constructor(InvestmentReportDto.class,
                        investmentReport.tradingFrequency.avg(),
                        investmentReport.cashRatio.avg(),
                        investmentReport.winLossRatio.avg(),
                        investmentReport.diversification.avg(),
                        investmentReport.stability.avg()
                ))
                .from(investmentReport)
                .where(investmentReport.date.eq(latestDate))
                .groupBy(investmentReport.date)
                .fetchOne();
    }
}
