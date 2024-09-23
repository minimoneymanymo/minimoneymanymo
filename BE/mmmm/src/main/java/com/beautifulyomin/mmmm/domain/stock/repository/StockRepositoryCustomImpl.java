package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.stock.constant.*;
import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockChartDto;
import com.beautifulyomin.mmmm.domain.stock.dto.data.DailyStockDataDto;
import com.beautifulyomin.mmmm.domain.stock.dto.request.StockFilterRequestDto;
import com.beautifulyomin.mmmm.domain.stock.dto.response.StockFilterResponseDto;
import com.beautifulyomin.mmmm.domain.stock.entity.*;
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
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final ChildrenRepository childrenRepository;
    private final StockRepository stockRepository;
    private final StockLikeRepository stockLikeRepository;

    @Autowired
    public StockRepositoryCustomImpl(JPAQueryFactory queryFactory, ChildrenRepository childrenRepository, StockRepository stockRepository, StockLikeRepository stockLikeRepository) {
        this.queryFactory = queryFactory;
        this.childrenRepository = childrenRepository;
        this.stockRepository = stockRepository;
        this.stockLikeRepository = stockLikeRepository;
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

        LocalDate latestDate = getLatestDateAtDailyStockData();
        log.debug("🍉🍉🍉🍉🍉 최신날짜 = {}", latestDate);
        BooleanBuilder condition = new BooleanBuilder();
        applyConditionByMarket(filterRequestDto, condition);
        applyConditionByMarketCapitalization(filterRequestDto, condition);
        applyConditionByEnterpriseValue(filterRequestDto, condition);
        applyConditionByPriceChange(filterRequestDto, condition);
        applyConditionByTrading(filterRequestDto, condition);

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
                .orderBy(buildOrderSpecifiers(pageable.getSort()))
                .fetch();

        long total = getTotal(latestDate, condition);
        return new PageImpl<>(results, pageable, total);
    }

    @Override
    public void toggleFavoriteStock(String userId, String stockCode) {
        Children children = childrenRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        Stock stocks = stockRepository.findById(stockCode)
                .orElseThrow(() -> new EntityNotFoundException("해당 주식을 찾을 수 없습니다."));

        Optional<StockLikes> existingLike = stockLikeRepository.findByChildrenAndStock(children, stocks);
        if (existingLike.isPresent()) {
            stockLikeRepository.delete(existingLike.get());
            return;
        }

        StockLikes newLike = StockLikes.builder()
                .children(children)
                .stock(stocks)
                .build();
        stockLikeRepository.save(newLike);
    }

    /**
     * 시장(코스피, 코스닥) 기준 필터링 조건 추가
     *
     * @param filterRequestDto 사용자의 필터링 조건
     * @param condition        필터 추가할 공간
     */
    private void applyConditionByMarket(StockFilterRequestDto filterRequestDto, BooleanBuilder condition) {
        if (filterRequestDto.getMarketType() != null) {
            MarketType marketType = MarketType.fromType(filterRequestDto.getMarketType());
            condition.and(stock.marketName.eq(marketType.getType()));
        }
    }

    /**
     * 시가총액(소, 중, 대) 기준 필터링 조건 추가
     */
    private void applyConditionByMarketCapitalization(StockFilterRequestDto filterRequestDto, BooleanBuilder condition) {
        if (filterRequestDto.getMarketCapSize() != null) {
            MarketCapSize marketCapSize = MarketCapSize.fromLabel(filterRequestDto.getMarketCapSize());
            condition.and(dailyStockData.marketCapitalization.goe(marketCapSize.getMinCapAsBigDecimal()))
                    .and(dailyStockData.marketCapitalization.loe(marketCapSize.getMaxCapAsBigDecimal()));
        }
    }

    /**
     * 기업 가치(PER, PBR, EPS, BPS) 기준 필터링 조건 추가
     */
    private void applyConditionByEnterpriseValue(StockFilterRequestDto filterRequestDto, BooleanBuilder condition) {
        if (filterRequestDto.getPerMin() != null) {
            condition.and(dailyStockData.peRatio.goe(filterRequestDto.getPerMin()));
        }
        if (filterRequestDto.getPerMax() != null) {
            condition.and(dailyStockData.peRatio.loe(filterRequestDto.getPerMax()));
        }
        if (filterRequestDto.getPbrMin() != null) {
            condition.and(dailyStockData.pbRatio.goe(filterRequestDto.getPbrMin()));
        }
        if (filterRequestDto.getPbrMax() != null) {
            condition.and(dailyStockData.pbRatio.loe(filterRequestDto.getPbrMax()));
        }
        if (filterRequestDto.getEpsMin() != null) {
            condition.and(dailyStockData.earningsPerShare.goe(filterRequestDto.getEpsMin()));
        }
        if (filterRequestDto.getEpsMax() != null) {
            condition.and(dailyStockData.earningsPerShare.loe(filterRequestDto.getEpsMax()));
        }
        if (filterRequestDto.getBpsMin() != null) {
            condition.and(dailyStockData.bookValuePerShare.goe(filterRequestDto.getBpsMin()));
        }
        if (filterRequestDto.getBpsMax() != null) {
            condition.and(dailyStockData.bookValuePerShare.loe(filterRequestDto.getBpsMax()));
        }
    }

    /**
     * 가격조건(주가, 주가 등락률, 52주 최고가, 52주 최저가) 기준 필터링 조건 추가
     */
    private void applyConditionByPriceChange(StockFilterRequestDto filterRequestDto, BooleanBuilder condition) {
        if (filterRequestDto.getPriceMin() != null) {
            condition.and(dailyStockChart.closingPrice.goe(filterRequestDto.getPriceMin()));
        }
        if (filterRequestDto.getPriceMax() != null) {
            condition.and(dailyStockChart.closingPrice.loe(filterRequestDto.getPriceMax()));
        }
        if (filterRequestDto.getChangeRateMin() != null) {
            condition.and(dailyStockData.priceChangeRate.goe(filterRequestDto.getChangeRateMin()));
        }
        if (filterRequestDto.getChangeRateMax() != null) {
            condition.and(dailyStockData.priceChangeRate.loe(filterRequestDto.getChangeRateMax()));
        }
        if (filterRequestDto.getHigh52WeekMin() != null) {
            condition.and(dailyStockChart.highestPrice.goe(filterRequestDto.getHigh52WeekMin()));
        }
        if (filterRequestDto.getHigh52WeekMax() != null) {
            condition.and(dailyStockChart.highestPrice.loe(filterRequestDto.getHigh52WeekMax()));
        }
        if (filterRequestDto.getLow52WeekMin() != null) {
            condition.and(dailyStockChart.lowestPrice.goe(filterRequestDto.getLow52WeekMin()));
        }
        if (filterRequestDto.getLow52WeekMax() != null) {
            condition.and(dailyStockChart.lowestPrice.loe(filterRequestDto.getLow52WeekMax()));
        }
    }

    /**
     * 거래량/거래대금(1일 누적 거래량, 1일 누적 거래 대금, 거래량 회전률) 기준 필터링 조건 추가
     */
    private void applyConditionByTrading(StockFilterRequestDto filterRequestDto, BooleanBuilder condition) {
        if (filterRequestDto.getVolumeMin() != null) {
            condition.and(dailyStockChart.tradingVolume.goe(filterRequestDto.getVolumeMin()));
        }
        if (filterRequestDto.getVolumeMax() != null) {
            condition.and(dailyStockChart.tradingVolume.loe(filterRequestDto.getVolumeMax()));
        }
        if (filterRequestDto.getTradingValueMin() != null) {
            condition.and(dailyStockData.tradingValue.goe(filterRequestDto.getTradingValueMin()));
        }
        if (filterRequestDto.getTradingValueMax() != null) {
            condition.and(dailyStockData.tradingValue.loe(filterRequestDto.getTradingValueMax()));
        }
        if (filterRequestDto.getVolumeTurnoverRatioMin() != null) {
            condition.and(dailyStockData.volumeTurnoverRatio.goe(filterRequestDto.getVolumeTurnoverRatioMin()));
        }
        if (filterRequestDto.getVolumeTurnoverRatioMax() != null) {
            condition.and(dailyStockData.volumeTurnoverRatio.loe(filterRequestDto.getVolumeTurnoverRatioMax()));
        }
    }

    /**
     * @return 주식 데이터에 존재하는 가장 최근 날짜
     */
    private LocalDate getLatestDateAtDailyStockData() {
        return queryFactory
                .select(dailyStockData.date.max())
                .from(dailyStockData)
                .fetchFirst();
    }

    /**
     * @return 페이지네이션 적용되는 총 목록 개수
     */
    private long getTotal(LocalDate latestDate, BooleanBuilder condition) {
        return queryFactory
                .select(stock.count())
                .from(stock)
                .join(dailyStockData).on(stock.stockCode.eq(dailyStockData.stockCode).and(dailyStockData.date.eq(latestDate)))
                .join(dailyStockChart).on(stock.stockCode.eq(dailyStockChart.stockCode).and(dailyStockChart.date.eq(latestDate)))
                .where(condition)
                .fetchOne();
    }

    /**
     * @param periodType 기간
     * @param stockCode  종목 코드
     * @return 기간별로 집계한 차트 데이터 리스트
     */
    private List<DailyStockChartDto> getLatestPeriodStockChart(PeriodType periodType, String stockCode) {
        LocalDate latestDate = fetchLatestDateByStockCode(stockCode);
        if (latestDate == null) {
            return Collections.emptyList();
        }
        NumberTemplate<Integer> periodNumberExpression = calculatePeriodNumber(periodType, latestDate, dailyStockChart.date);
        Map<Integer, List<Tuple>> periodGroups = groupByPeriod(periodType, stockCode, periodNumberExpression);
        return summarizePeriodStockCharts(periodGroups);
    }

    /**
     * @param sort 사용자로부터 받은 정렬 기준
     * @return 정렬 기준 (여러개 가능)
     */
    private OrderSpecifier<?>[] buildOrderSpecifiers(Sort sort) {
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

            if (++idx >= PERIOD_LIMIT_CNT) {
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

    /**
     * @return 종목 코드 기준 차트 상 가장 최신 날짜
     */
    private LocalDate fetchLatestDateByStockCode(String stockCode) {
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

    /**
     * 그룹화 잘 되었나 확인하는 메서드
     */
    private void logTuples(List<Tuple> groupedPeriod) {
        groupedPeriod.forEach(tuple -> {
            LocalDate date = tuple.get(dailyStockChart.date);
            Integer periodNumber = tuple.get(7, Integer.class); // 7번 인덱스는 periodNumberExpression의 위치
            log.info("Date: {}, Week Number: {}", date, periodNumber);
        });
    }

}
