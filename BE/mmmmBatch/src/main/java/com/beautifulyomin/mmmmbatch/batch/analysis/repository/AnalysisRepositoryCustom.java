package com.beautifulyomin.mmmmbatch.batch.analysis.repository;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.QStocksHeld;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.QTradeRecord;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.TradeRecord;
import com.beautifulyomin.mmmmbatch.batch.stock.entity.QStock;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Repository
@AllArgsConstructor
public class AnalysisRepositoryCustom {
    private final JPAQueryFactory queryFactory;
    private final QTradeRecord tradeRecord = QTradeRecord.tradeRecord;
    private final QStocksHeld stocksHeld = QStocksHeld.stocksHeld;
    private final QStock stock = QStock.stock;
    private final EntityManager entityManager;

    public int getTotalAmountSumByChildrenId(Integer childrenId) {
        Integer totalAmountSum = queryFactory.select(stocksHeld.totalAmount.sum())
                .from(stocksHeld)
                .where(stocksHeld.children.childrenId.eq(childrenId))
                .fetchOne();
        return totalAmountSum != null ? totalAmountSum : 0;
    }

    public long countTradesByChildrenIdAndDateRange(Integer childrenId, String startDate, String endDate) {
        return queryFactory
                .select(tradeRecord.count())
                .from(tradeRecord)
                .where(tradeRecord.children.childrenId.eq(childrenId)
                        .and(tradeRecord.createdAt.between(startDate, endDate)))
                .fetchOne();
    }

    public Integer getTotalStockValueByChildrenId(Integer childrenId, String startDate, String endDate) {
        return queryFactory
                .select(stocksHeld.totalAmount.sum())
                .from(stocksHeld)
                .where(stocksHeld.children.childrenId.eq(childrenId))
                .fetchOne();
    }

    public List<TradeRecord> getTradeRecordsByDateRange(Integer childrenId, String startDate, String endDate) {
        return queryFactory
                .select(tradeRecord)
                .from(tradeRecord)
                .where(tradeRecord.children.childrenId.eq(childrenId)
                        .and(tradeRecord.createdAt.between(startDate, endDate)))
                .fetch();
    }


    public List<String> findAllMarketTypeByChildrenId(Integer childrenId, String startDate, String endDate) {
        return queryFactory
                .select(stock.marketName)
                .from(stocksHeld)
                .join(stocksHeld.stock, stock)
                .where(stocksHeld.children.childrenId.eq(childrenId))
                .fetch();
    }

    public Double getAverageCashByChildrenIdAndDateRange(Integer childrenId, String startDate, String endDate) {
        return queryFactory
                .select(tradeRecord.remainAmount.avg())
                .from(tradeRecord)
                .where(tradeRecord.children.childrenId.eq(childrenId)
                        .and(tradeRecord.createdAt.between(startDate, endDate)))
                .fetchOne();
    }

    //평균 주식 보유 기간

    /**
     * 가장 최근 거래가 매도 거래('5')의 경우: 가장 최근 매수 날짜를 서브쿼리 찾기.
     * 가장 최근 거래가 매수 거래('4')의 경우: 매수 날짜부터 endDate까지의 기간을 계산.
     */
    public Double getAverageHoldingPeriod(Integer childrenId, LocalDate startDate, LocalDate endDate) {
        QTradeRecord tradeRecord = QTradeRecord.tradeRecord;
        QStocksHeld stocksHeld = QStocksHeld.stocksHeld;

        // 각 주식별 보유 기간을 저장할 리스트
        List<Double> holdingPeriods = new ArrayList<>();

        // 보유 중인 모든 주식 코드 가져오기
        List<String> stockCodes = queryFactory
                .select(stocksHeld.stock.stockCode)
                .from(stocksHeld)
                .where(stocksHeld.children.childrenId.eq(childrenId))
                .fetch();

        for (String stockCode : stockCodes) {
            // 최신 거래 기록을 위한 서브 쿼리 (가장 최근 거래 타입)
            String latestTradeType = queryFactory
                    .select(tradeRecord.tradeType)
                    .from(tradeRecord)
                    .where(tradeRecord.children.childrenId.eq(childrenId)
                            .and(tradeRecord.stock.stockCode.eq(stockCode)))
                    .orderBy(tradeRecord.createdAt.desc())
                    .limit(1)
                    .fetchOne();

            // 마지막 매수일을 위한 서브 쿼리
            String lastBuyDateResult = queryFactory
                    .select(tradeRecord.createdAt)
                    .from(tradeRecord)
                    .where(tradeRecord.children.childrenId.eq(childrenId)
                            .and(tradeRecord.tradeType.eq("4")) // 매수 거래
                            .and(tradeRecord.stock.stockCode.eq(stockCode)))
                    .orderBy(tradeRecord.createdAt.desc())
                    .limit(1)
                    .fetchOne();

            Double holdingPeriod = 0.0;

            if ("5".equals(latestTradeType)) { // 매도 거래인 경우
                if (lastBuyDateResult != null) {
                    LocalDate lastBuyDateParsed = LocalDate.parse(lastBuyDateResult, DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
                    // 보유 기간 계산
                    Duration duration = Duration.between(lastBuyDateParsed.atStartOfDay(), endDate.atStartOfDay());
                    holdingPeriod = (double) duration.toDays();
                }
            } else if ("4".equals(latestTradeType)) { // 매수 거래인 경우
                if (lastBuyDateResult != null) {
                    LocalDate lastBuyDateParsed = LocalDate.parse(lastBuyDateResult, DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
                    // 매수 날짜부터 endDate까지의 기간 계산
                    Duration duration = Duration.between(lastBuyDateParsed.atStartOfDay(), endDate.atStartOfDay());
                    holdingPeriod = (double) duration.toDays();
                }
            }

            holdingPeriods.add(holdingPeriod);
        }

        // 보유 기간의 평균 계산
        return holdingPeriods.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }


    //총 매수 금액
    public Integer getTotalBuyAmount(Integer childrenId, String startDate, String endDate) {
        return queryFactory
                .select(tradeRecord.amount.sum())
                .from(tradeRecord)
                .where(tradeRecord.children.childrenId.eq(childrenId)
                        .and(tradeRecord.createdAt.between(startDate, endDate))
                        .and(tradeRecord.tradeType.eq("4"))) // 매수 거래
                .fetchOne();
    }


    //총 매도 금액
    public Integer getTotalSellAmount(Integer childrenId, String startDate, String endDate) {
        return queryFactory
                .select(tradeRecord.amount.sum())
                .from(tradeRecord)
                .where(tradeRecord.children.childrenId.eq(childrenId)
                        .and(tradeRecord.createdAt.between(startDate, endDate))
                        .and(tradeRecord.tradeType.eq("5"))) // 매도 거래
                .fetchOne();
    }

    //월별 포트폴리오의 가치
    public List<Tuple> getDailyPortfolioValues(Integer childrenId, String startDate, String endDate) {
        return queryFactory
                .select(Expressions.stringTemplate("TO_DATE({0}, 'YYYYMMDDHH24MISS')", tradeRecord.createdAt),
                        tradeRecord.remainAmount.add(stocksHeld.totalAmount.sum()))
                .from(tradeRecord)
                .leftJoin(stocksHeld).on(stocksHeld.children.childrenId.eq(tradeRecord.children.childrenId))
                .where(tradeRecord.children.childrenId.eq(childrenId)
                        .and(tradeRecord.createdAt.between(startDate, endDate)))
                .groupBy(Expressions.stringTemplate("TO_DATE({0}, 'YYYYMMDDHH24MISS')", tradeRecord.createdAt))
                .orderBy(Expressions.stringTemplate("TO_DATE({0}, 'YYYYMMDDHH24MISS')", tradeRecord.createdAt).asc())
                .fetch();
    }

    public int countStockHeldByDate(Integer childrenId, String endDate) {
        return queryFactory.select(stocksHeld.stock.stockCode)
                .from(stocksHeld)
                .where(stocksHeld.children.childrenId.eq(childrenId))
                .fetch()
                .size();
    }

    public BigDecimal getRemainSharesCountSum(Integer childrenId) {
        BigDecimal result = queryFactory.select(stocksHeld.remainSharesCount.sum())
                .from(stocksHeld)
                .where(stocksHeld.children.childrenId.eq(childrenId))
                .fetchOne();
        return result != null ? result : BigDecimal.ZERO;
    }

    public Integer getMonthlyStartMoney(Integer childrenId, String startDateStr) {
        Integer result = queryFactory.select(tradeRecord.remainAmount.add(tradeRecord.amount))
                .from(tradeRecord)
                .where(tradeRecord.createdAt.goe(startDateStr)
                        .and(tradeRecord.children.childrenId.eq(childrenId)))
                .orderBy(tradeRecord.createdAt.asc())
                .fetchFirst();

        // null 처리: 값이 없으면 기본값 0을 반환
        return result != null ? result : 0;
    }

}
