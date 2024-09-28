package com.beautifulyomin.mmmmbatch.batch.analysis.repository;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.QStocksHeld;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.QTradeRecord;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@AllArgsConstructor
public class AnalysisCustom {
    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager;
    private final QTradeRecord tradeRecord = QTradeRecord.tradeRecord;
    private final QStocksHeld stocksHeld = QStocksHeld.stocksHeld;

    public long countTradesByChildrenIdAndDateRange(Integer childrenId, String startDate, String endDate) {
        Long tradRecordCount = queryFactory
                .select(tradeRecord.count())
                .from(tradeRecord)
                .where(tradeRecord.children.childrenId.eq(childrenId)
                        .and(tradeRecord.createdAt.between(startDate, endDate)))
                .fetchOne();
        return tradRecordCount != null ? tradRecordCount : 0;
    }

    public int getTotalAmountSumByChildrenId(Integer childrenId) {
        Integer totalAmountSum = queryFactory.select(stocksHeld.totalAmount.sum())
                .from(stocksHeld)
                .where(stocksHeld.children.childrenId.eq(childrenId))
                .fetchOne();
        return totalAmountSum != null ? totalAmountSum : 0;
    }
}
