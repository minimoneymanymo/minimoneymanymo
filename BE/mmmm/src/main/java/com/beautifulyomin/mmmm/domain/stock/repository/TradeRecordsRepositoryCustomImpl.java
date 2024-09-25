package com.beautifulyomin.mmmm.domain.stock.repository;

import com.beautifulyomin.mmmm.domain.fund.entity.QTradeRecord;
import com.beautifulyomin.mmmm.domain.member.entity.QChildren;
import com.beautifulyomin.mmmm.domain.member.entity.QParent;
import com.beautifulyomin.mmmm.domain.stock.dto.TradeDto;
import com.beautifulyomin.mmmm.domain.stock.entity.QStock;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.Optional;

public class TradeRecordsRepositoryCustomImpl implements TradeRecordsRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;
    private final EntityManager entityManager;

    public TradeRecordsRepositoryCustomImpl(JPAQueryFactory jpaQueryFactory, EntityManager entityManager) { this.jpaQueryFactory = jpaQueryFactory;
        this.entityManager = entityManager;
    }

    @Override
    public TradeDto findTradeByStockCode(String stockCode) {
        QTradeRecord tradeRecord = QTradeRecord.tradeRecord;
        QStock stock = QStock.stock;

        return jpaQueryFactory
                .select(Projections.constructor(TradeDto.class,
                        tradeRecord.amount,
                        tradeRecord.tradeSharesCount,
                        tradeRecord.reason,
                        tradeRecord.tradeType,
                        tradeRecord.remainAmount
                        ))
                .from(tradeRecord)
                .join(tradeRecord.stock, stock)
                .where(stock.stockCode.eq(stockCode))
                .fetchOne();
    }

    @Override
    public Optional<TradeDto> findTredeByCreateAt(String createAt) {
        QTradeRecord tradeRecord = QTradeRecord.tradeRecord;

        return Optional.ofNullable(jpaQueryFactory
                .select(Projections.constructor(TradeDto.class,
                        tradeRecord.amount,
                        tradeRecord.tradeSharesCount,
                        tradeRecord.reason,
                        tradeRecord.tradeType,
                        tradeRecord.remainAmount
                ))
                .from(tradeRecord)
                .where(tradeRecord.createdAt.eq(createAt))
                .fetchOne());
    }

    @Override
    @Transactional
    public long UpdateReasonBonusMoneyByCreateAt(String parentUserId, Integer childrenId, Integer reasonBonusMoney, String createAt) {
        QTradeRecord tradeRecord = QTradeRecord.tradeRecord;
        QChildren children = QChildren.children;
        QParent parent = QParent.parent;
        //이유보상머니 업데이트함.
        long rows = jpaQueryFactory
                .update(tradeRecord)
                .set(tradeRecord.reasonBonusMoney,reasonBonusMoney)
                .where(tradeRecord.createdAt.eq(createAt))
                .execute();

        if(rows== 1){ //업데이트 발생하면
            //자식의 머니 잔액 변경
            jpaQueryFactory
                    .update(children)
                    .set(children.money, children.money.add(reasonBonusMoney))
                    .where(children.childrenId.eq(childrenId))
                    .execute();
            //부모의 마니모 계좌 충전금액 변경
            jpaQueryFactory
                    .update(parent)
                    .set(parent.balance, parent.balance.subtract(reasonBonusMoney))
                    .where(parent.userId.eq(parentUserId))
                    .execute();
        }
        // 즉시 반영을 위함 -> 영속성 컨텍스트에 값이 남아있지 않도록!
        entityManager.flush();
        entityManager.clear();
        return rows;
    }
}
