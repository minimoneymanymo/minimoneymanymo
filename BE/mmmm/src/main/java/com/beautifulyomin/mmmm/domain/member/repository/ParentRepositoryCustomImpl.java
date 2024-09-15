package com.beautifulyomin.mmmm.domain.member.repository;

import com.beautifulyomin.mmmm.domain.fund.entity.QStocksHeld;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenWaitingDto;
import com.beautifulyomin.mmmm.domain.member.entity.QChildren;
import com.beautifulyomin.mmmm.domain.member.entity.QParentAndChildren;
import com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockChart;
import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.beans.Transient;
import java.math.BigDecimal;
import java.util.List;

@Repository
public class ParentRepositoryCustomImpl implements ParentRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    public ParentRepositoryCustomImpl(JPAQueryFactory jpaQueryFactory) {
        this.jpaQueryFactory = jpaQueryFactory;
    }

    @Override
    public List<Integer> findAllMyChildrenIdByParentUserId(String parentUserId) {
        QParentAndChildren parentAndChildren = QParentAndChildren.parentAndChildren;
        return jpaQueryFactory
                .select(parentAndChildren.child.childrenId)
                .from(QParentAndChildren.parentAndChildren)
                .where(parentAndChildren.parent.userId.eq(parentUserId),
                        parentAndChildren.isApproved.eq(true))
                .fetch();
    }

    @Override
    public MyChildrenDto findAllMyChildrenByChildId(Integer childrenId) {
        QChildren children = QChildren.children;
        QStocksHeld stocksHeld = QStocksHeld.stocksHeld;
        QDailyStockChart dailyStockChart = QDailyStockChart.dailyStockChart;

        BigDecimal totalAmount = jpaQueryFactory
                .select(stocksHeld.remainSharesCount.multiply(dailyStockChart.closingPrice).sum())
                .from(stocksHeld)
                .join(dailyStockChart)
                .on(stocksHeld.stock.stockCode.eq(dailyStockChart.id.stockCode))
                .where(stocksHeld.children.childrenId.eq(childrenId))
                .fetchOne();

        //메인쿼리 MyChildrenDto반환
        return jpaQueryFactory
                .select(Projections.constructor(MyChildrenDto.class,
                        children.childrenId,
                        children.userId,
                        children.name,
                        children.profileImgUrl,
                        children.createdAt,
                        children.money,
                        children.withdrawableMoney,
                        ConstantImpl.create(totalAmount != null ? totalAmount : BigDecimal.ZERO)
                ))
                .from(children)
                .where(children.childrenId.eq(childrenId))
                .fetchOne();
    }

    @Override
    public List<MyChildrenWaitingDto> findNotApprovedMyChildrenByParentUserId(String parentUserId) {
        QParentAndChildren parentAndChildren = QParentAndChildren.parentAndChildren;

        return jpaQueryFactory
                .select(Projections.constructor(MyChildrenWaitingDto.class,
                        parentAndChildren.child.childrenId,
                        parentAndChildren.child.userId,
                        parentAndChildren.child.name,
                        parentAndChildren.child.createdAt))
                .from(parentAndChildren)
                .where(parentAndChildren.parent.userId.eq(parentUserId),
                        parentAndChildren.isApproved.isFalse())
                .fetch();
    }



    @Override
    @Transactional
    public long updateIsApprovedById(Integer parentId, Integer childrenId) {
        QParentAndChildren parentAndChildren = QParentAndChildren.parentAndChildren;

        return jpaQueryFactory
                .update(parentAndChildren)
                .set(parentAndChildren.isApproved,true)
                .where(parentAndChildren.parent.parentId.eq(parentId)
                        .and(parentAndChildren.child.childrenId.eq(childrenId)))
                .execute();
    }

}