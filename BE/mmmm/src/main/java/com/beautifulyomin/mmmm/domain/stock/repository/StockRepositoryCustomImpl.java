package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.stock.constant.PeriodType;
import com.beautifulyomin.mmmm.domain.stock.constant.SortCriteria;
import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockChartDto;
import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockDataDto;
import com.beautifulyomin.mmmm.domain.stock.dto.request.StockFilterRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockFilterResponseDto;
import com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockChart;
import com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockData;
import com.beautifulyomin.mmmm.domain.stock.entity.QStock;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.DatePath;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Repository
public class StockRepositoryCustomImpl implements StockRepositoryCustom {
    private static final int PERIOD_LIMIT_CNT = 30;
    private final JPAQueryFactory queryFactory;
    private final QStock stock = QStock.stock;
    private final QDailyStockData dailyStockData = QDailyStockData.dailyStockData;
    private final QDailyStockChart dailyStockChart = QDailyStockChart.dailyStockChart;

    public StockRepositoryCustomImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public DailyStockDataDto findLatestDateByStockCode(String stockCode) {
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
        return getLatestPeriodStockChart(PeriodType.WEEK, stockCode);
    }

    @Override
    public List<DailyStockChartDto> getLatestMonthlyStockChart(String stockCode) {
        return getLatestPeriodStockChart(PeriodType.MONTH, stockCode);
    }

    @Override
    public DailyStockChartDto getDailyStockChart(String stockCode) {
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
                .fetchFirst();
    }

    @Override
    public Page<StockFilterResponseDto> findStocksWithFilters(StockFilterRequestDto filterRequestDto, Pageable pageable) {

        //최신 날짜 가져오는 서브쿼리
        LocalDate latestDate = queryFactory
                .select(dailyStockChart.date.max())
                .from(dailyStockChart)
                .fetchFirst();

        //필터링 조건 생성
        BooleanBuilder condition = new BooleanBuilder(); //필터링 조건

        List<StockFilterResponseDto> results = queryFactory
                .select(Projections.constructor(StockFilterResponseDto.class,
                        stock.companyName,
                        stock.stockCode,
                        dailyStockChart.date,
                        dailyStockChart.closingPrice,
                        dailyStockData.priceChangeSign,
                        dailyStockData.priceChange,
                        dailyStockData.priceChangeRate,
                        dailyStockData.marketCapitalization,
                        dailyStockChart.tradingVolume
                ))
                .from(stock)
                .join(dailyStockData)
                .on(stock.stockCode.eq(dailyStockData.stockCode)
                        .and(dailyStockData.date.eq(latestDate)))
                .join(dailyStockChart)
                .on(stock.stockCode.eq(dailyStockChart.stockCode)
                        .and(dailyStockChart.date.eq(latestDate)))
                .where(condition)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(getOrderSpecifiers(pageable.getSort()))
                .fetch();

        // 총 개수 계산 (다음 페이지네이션에 사용)
        long total = queryFactory
                .select(stock.count())
                .from(stock)
                .join(dailyStockData).on(stock.stockCode.eq(dailyStockData.stockCode).and(dailyStockData.date.eq(latestDate)))
                .join(dailyStockChart).on(stock.stockCode.eq(dailyStockChart.stockCode).and(dailyStockChart.date.eq(latestDate)))
                .where(condition)
                .fetchOne();

        return new PageImpl<>(results, pageable, total);
    }

    private List<DailyStockChartDto> getLatestPeriodStockChart(PeriodType periodType, String stockCode) {
        LocalDate latestDate = fetchLatestDate(stockCode);
        if (latestDate == null) {
            return Collections.emptyList();
        }
        NumberTemplate<Integer> periodNumberExpression = calculatePeriodNumber(periodType, latestDate, dailyStockChart.date);
        Map<Integer, List<Tuple>> periodGroups = groupByPeriod(periodType, stockCode, periodNumberExpression);
        return summarizePeriodStockCharts(periodGroups);
    }

    private List<DailyStockChartDto> summarizePeriodStockCharts(Map<Integer, List<Tuple>> periodGroups) {
        List<DailyStockChartDto> periodStockCharts = new ArrayList<>();
        int idx = 0;
        for (Map.Entry<Integer, List<Tuple>> entry : periodGroups.entrySet()) {
            List<Tuple> periodData = entry.getValue();
            if (periodData.isEmpty()) {
                continue;
            }
            LocalDate periodStartDate = periodData.get(0).get(dailyStockChart.date);
            BigDecimal periodOpeningPrice = periodData.get(0).get(dailyStockChart.operatingPrice);
            BigDecimal periodClosingPrice = periodData.get(periodData.size() - 1).get(dailyStockChart.closingPrice);
            BigDecimal periodHighestPrice = getHighestPrice(periodData);
            BigDecimal periodLowestPrice = getLowestPrice(periodData);
            BigInteger periodTradingVolume = getTotalTradingVolume(periodData);

            periodStockCharts.add(new DailyStockChartDto(
                    periodStartDate, periodHighestPrice, periodLowestPrice, periodTradingVolume, periodOpeningPrice, periodClosingPrice));

            if (++idx >= PERIOD_LIMIT_CNT) { //30개까지만 조회
                break;
            }
        }
        return periodStockCharts;
    }

    private BigInteger getTotalTradingVolume(List<Tuple> periodData) {
        return periodData.stream()
                .map(tuple -> tuple.get(dailyStockChart.tradingVolume))
                .reduce(BigInteger.ZERO, BigInteger::add);
    }

    private BigDecimal getLowestPrice(List<Tuple> periodData) {
        return periodData.stream()
                .map(tuple -> tuple.get(dailyStockChart.lowestPrice))
                .filter(Objects::nonNull)
                .min(BigDecimal::compareTo)
                .orElse(null);
    }

    private BigDecimal getHighestPrice(List<Tuple> periodData) {
        return periodData.stream()
                .map(tuple -> tuple.get(dailyStockChart.highestPrice))
                .filter(Objects::nonNull)
                .max(BigDecimal::compareTo)
                .orElse(null);
    }

    private Map<Integer, List<Tuple>> groupByPeriod(PeriodType periodType, String stockCode, NumberTemplate<Integer> periodNumberExpression) {
        List<Tuple> groupedPeriods = queryFactory
                .select(
                        dailyStockChart.date,
                        dailyStockChart.stockCode,
                        dailyStockChart.operatingPrice,
                        dailyStockChart.highestPrice,
                        dailyStockChart.lowestPrice,
                        dailyStockChart.closingPrice,
                        dailyStockChart.tradingVolume,
                        periodNumberExpression.as(periodType.getDateTruncUnit() + "Number")
                )
                .from(dailyStockChart)
                .where(dailyStockChart.stockCode.eq(stockCode))
                .orderBy(periodNumberExpression.asc(), dailyStockChart.date.asc())
                .fetch();

//        logTuples(groupedPeriods);
        return groupedPeriods.stream()
                .filter(tuple -> tuple.get(7, Integer.class) != null) //index7= 기간별로 묶고 넘버링 한 값
                .collect(Collectors.groupingBy(tuple -> tuple.get(7, Integer.class)));
    }

    private LocalDate fetchLatestDate(String stockCode) {
        return queryFactory
                .select(dailyStockChart.date.max())
                .from(dailyStockChart)
                .where(dailyStockChart.stockCode.eq(stockCode))
                .fetchFirst();
    }

    /**
     * 주차를 계산하는 메서드
     *
     * @param latestDate 가장 최근 날짜 (기준)
     * @param datePath   주차를 알고 싶은 날짜
     */
    private NumberTemplate<Integer> calculatePeriodNumber(PeriodType periodType, LocalDate latestDate, DatePath<LocalDate> datePath) {
        return Expressions.numberTemplate(Integer.class,
                "FLOOR((EXTRACT(EPOCH FROM DATE_TRUNC('" + periodType.getDateTruncUnit() + "', CAST({0} AS timestamp))) - " +
                        "EXTRACT(EPOCH FROM DATE_TRUNC('" + periodType.getDateTruncUnit() + "', CAST({1} AS timestamp)))) /" + periodType.getPeriodDivision() + ")",
                latestDate, datePath);
    }

    private void logTuples(List<Tuple> groupedWeeks) {
        groupedWeeks.forEach(tuple -> {
            LocalDate date = tuple.get(dailyStockChart.date);
            Integer weekNumber = tuple.get(7, Integer.class); // 7번 인덱스는 weekNumberExpression의 위치
            log.info("Date: {}, Week Number: {}", date, weekNumber);
        });
    }

    private OrderSpecifier<?>[] getOrderSpecifiers(Sort sort) {
        return sort.stream()
                .map(order -> {
                    SortCriteria sortCriteria = SortCriteria.fromValue(order.getProperty().toUpperCase());
                    PathBuilder<Object> pathBuilder = new PathBuilder<>(QDailyStockData.class, "dailyStockData");
                    return new OrderSpecifier(
                            order.isAscending() ? Order.ASC : Order.DESC,
                            pathBuilder.get(sortCriteria.getDbField())
                    );
                })
                .toArray(OrderSpecifier[]::new);
    }

}
