package com.beautifulyomin.mmmmbatch.batch.analysis.repository;

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

    public long countTradesByChildrenIdAndDateRange(Integer childrenId, String startDate, String endDate) {
        return queryFactory
                .select(tradeRecord.count())
                .from(tradeRecord)
                .where(tradeRecord.children.childrenId.eq(childrenId)
                        .and(tradeRecord.createdAt.between(startDate, endDate)))
                .fetchOne();
    }
}
