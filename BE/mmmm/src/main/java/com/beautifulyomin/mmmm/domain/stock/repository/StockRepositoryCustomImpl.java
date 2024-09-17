package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockChartDto;
import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockDataDto;
import com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockChart;
import com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockData;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.DatePath;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import static com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockChart.dailyStockChart;

@Slf4j
@Repository
public class StockRepositoryCustomImpl implements StockRepositoryCustom {
    private final int PERIOD_LIMIT_CNT=30;
    private final JPAQueryFactory queryFactory;

    public StockRepositoryCustomImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public DailyStockDataDto findLatestDateByStockCode(String stockCode) {
        QDailyStockData dailyStockData = QDailyStockData.dailyStockData;
        return queryFactory
                .select(Projections.constructor(DailyStockDataDto.class,
                        dailyStockData.stockCode,
                        dailyStockData.date,
                        dailyStockData.marketCapitalization,
                        dailyStockData.priceChangeSign,
                        dailyStockData.priceChange,
                        dailyStockData.priceChangeRate,
                        dailyStockData.peRatio,
                        dailyStockData.pbRatio,
                        dailyStockData.earningsPerShare,
                        dailyStockData.bookValuePerShare,
                        dailyStockData.foreignNetBuyVolume,
                        dailyStockData.htsForeignExhaustionRate,
                        dailyStockData.programNetBuyVolume,
                        dailyStockData.volumeTurnoverRatio,
                        dailyStockData.tradingValue,
                        dailyStockData.outstandingShares))
                .from(dailyStockData)
                .where(dailyStockData.stockCode.eq(stockCode))
                .orderBy(dailyStockData.date.desc())
                .limit(1)
                .fetchOne();
    }

    @Override
    public List<DailyStockChartDto> getLatestDailyStockCharts(String stockCode) {
        QDailyStockChart dailyStockChart = QDailyStockChart.dailyStockChart;
        return queryFactory.select(Projections.constructor(DailyStockChartDto.class,
                        dailyStockChart.date,
                        dailyStockChart.highestPrice,
                        dailyStockChart.lowestPrice,
                        dailyStockChart.tradingVolume,
                        dailyStockChart.operatingPrice,
                        dailyStockChart.closingPrice
                ))
                .from(dailyStockChart)
                .where(dailyStockChart.stockCode.eq(stockCode))
                .orderBy(dailyStockChart.date.desc())
                .stream().limit(PERIOD_LIMIT_CNT).toList();
    }

    @Override
    public List<DailyStockChartDto> getLatestWeeklyStockChart(String stockCode) {
        // Step 1: 최신 날짜를 가져오기
        LocalDate latestDate = queryFactory
                .select(dailyStockChart.date.max())
                .from(dailyStockChart)
                .where(dailyStockChart.stockCode.eq(stockCode))
                .fetchFirst();

        log.info("🌟🌟🌟🌟🌟latestDate = {}", latestDate);

        // Step 2: 주차별 데이터 그룹화
        NumberTemplate<Integer> weekNumberExpression = calculateWeekNumber(latestDate, dailyStockChart.date);

        log.info("🔥🔥🔥weekNumberExpression = {}", weekNumberExpression);

        List<Tuple> groupedWeeks = queryFactory
                .select(
                        dailyStockChart.date,
                        dailyStockChart.stockCode,
                        dailyStockChart.operatingPrice,
                        dailyStockChart.highestPrice,
                        dailyStockChart.lowestPrice,
                        dailyStockChart.closingPrice,
                        dailyStockChart.tradingVolume,
                        weekNumberExpression.as("weekNumber")
                )
                .from(dailyStockChart)
                .where(dailyStockChart.stockCode.eq(stockCode))
                .orderBy(weekNumberExpression.asc(), dailyStockChart.date.asc())
                .fetch();

        // 각 튜플의 주차 번호를 인덱스로 접근하여 확인 및 출력
        groupedWeeks.forEach(tuple -> {
            LocalDate date = tuple.get(dailyStockChart.date);
            Integer weekNumber = tuple.get(7, Integer.class); // 7번 인덱스는 weekNumberExpression의 위치
            log.info("Date: {}, Week Number: {}", date, weekNumber);
        });

        // Step 3: 주차별 데이터를 Map에 그룹화
        Map<Integer, List<Tuple>> weekGroups = groupedWeeks.stream()
                .filter(tuple -> tuple.get(7, Integer.class) != null) // 인덱스 7의 weekNumber가 null이 아닌 경우
                .collect(Collectors.groupingBy(tuple -> tuple.get(7, Integer.class)));

        log.info("❗❗❗❗❗weekGroups = {}", weekGroups);


        // step 4: 주차별로 집계 함수 적용
        List<DailyStockChartDto> weeklyStockCharts = new ArrayList<>();
        int idx = 1;
        for (Map.Entry<Integer, List<Tuple>> entry : weekGroups.entrySet()) {
            List<Tuple> weekData = entry.getValue();
            LocalDate weekStartDate = weekData.get(0).get(dailyStockChart.date);
            BigDecimal openingPrice = weekData.get(0).get(dailyStockChart.operatingPrice);
            BigDecimal closingPrice = weekData.get(weekData.size() - 1).get(dailyStockChart.closingPrice);

            BigDecimal highestPrice = weekData.stream()
                    .map(tuple -> tuple.get(dailyStockChart.highestPrice))
                    .filter(Objects::nonNull)
                    .max(BigDecimal::compareTo)
                    .orElse(null);

            BigDecimal lowestPrice = weekData.stream()
                    .map(tuple -> tuple.get(dailyStockChart.lowestPrice))
                    .filter(Objects::nonNull)
                    .min(BigDecimal::compareTo)
                    .orElse(null);

            BigInteger tradingVolume = weekData.stream()
                    .map(tuple -> tuple.get(dailyStockChart.tradingVolume))
                    .reduce(BigInteger.ZERO, BigInteger::add);

            weeklyStockCharts.add(new DailyStockChartDto(
                    weekStartDate, highestPrice, lowestPrice, tradingVolume, openingPrice, closingPrice));

            if (idx++ >= PERIOD_LIMIT_CNT) { //30개까지만 조회
                break;
            }
        }

        return weeklyStockCharts;
    }

    /**
     * 주차를 계산하는 메서드
     *
     * @param latestDate 가장 최근 날짜 (기준)
     * @param datePath   주차를 알고 싶은 날짜
     */
    private NumberTemplate<Integer> calculateWeekNumber(LocalDate latestDate, DatePath<LocalDate> datePath) {
        return Expressions.numberTemplate(Integer.class,
                "FLOOR((EXTRACT(EPOCH FROM DATE_TRUNC('week', CAST({0} AS timestamp))) - " +
                        "EXTRACT(EPOCH FROM DATE_TRUNC('week', CAST({1} AS timestamp)))) / (7 * 24 * 60 * 60))",
                latestDate, datePath);
    }


    @Override
    public List<DailyStockChartDto> getLatestMonthlyStockChart(String stockCode) {
        return List.of();
    }
}
