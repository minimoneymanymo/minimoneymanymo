package com.beautifulyomin.mmmm.domain.analysis.service;

import com.beautifulyomin.mmmm.constant.RedisExpireTime;
import com.beautifulyomin.mmmm.constant.RedisKey;
import com.beautifulyomin.mmmm.domain.analysis.dto.response.InvestmentReportDto;
import com.beautifulyomin.mmmm.domain.analysis.entity.InvestmentReport;
import com.beautifulyomin.mmmm.domain.analysis.repository.InvestmentAnalysisRepository;
import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.util.JsonConverter;
import com.beautifulyomin.mmmm.util.RedisUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.time.LocalDate;

@Service
@AllArgsConstructor
public class AnalysisServiceImpl implements AnalysisService {

    private final InvestmentAnalysisRepository investmentAnalysisRepository;
    private final ChildrenRepository childrenRepository;
    private final AnalysisRepositoryCustom analysisRepositoryCustom;
    private final RedisUtil redisUtil;
    private final JsonConverter jsonConverter;

    @Override
    public Map<String, InvestmentReportDto> getAnalysisReport(String userId) {
        Children children = childrenRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저가 없습니다: " + userId));

        LocalDate latestDate = analysisRepositoryCustom.findLatestDate();
        InvestmentReport investmentReport = investmentAnalysisRepository
                .findByChildrenIdAndDate(children.getChildrenId(), latestDate);

        return Map.of(
                "myStatistics", mapToInvestmentReportDto(investmentReport, children.getName()),
                "overallStatistics", getOverallStatistics(latestDate)
        );
    }

    private InvestmentReportDto mapToInvestmentReportDto(InvestmentReport investmentReport, String childName) {
        return InvestmentReportDto.builder()
                .name(childName)
                .cashRatio(investmentReport.getCashRatio().doubleValue())
                .stability(investmentReport.getStability())
                .winLossRatio(investmentReport.getWinLossRatio().doubleValue())
                .diversification(investmentReport.getDiversification())
                .tradingFrequency(investmentReport.getTradingFrequency())
                .investmentType(investmentReport.getInvestmentType())
                .build();
    }

    private InvestmentReportDto getOverallStatistics(LocalDate latestDate) {
        String cacheKey = RedisKey.OVERALL_STATISTICS.format(latestDate);
        String cachedData = redisUtil.getData(cacheKey);

        if (cachedData != null && !cachedData.isEmpty()) {
            return jsonConverter.convertFromJson(cachedData, InvestmentReportDto.class);
        }

        InvestmentReportDto overallStatistic = analysisRepositoryCustom.overallStatisticsByDate(latestDate);
        redisUtil.setDataExpire(cacheKey, jsonConverter.convertToJson(overallStatistic), RedisExpireTime.REPORT_CACHE_SEC.getExpireTime());

        return overallStatistic;
    }

}
