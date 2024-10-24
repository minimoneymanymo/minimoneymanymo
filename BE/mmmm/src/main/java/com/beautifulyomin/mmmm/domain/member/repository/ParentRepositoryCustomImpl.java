package com.beautifulyomin.mmmm.domain.member.repository;

import com.beautifulyomin.mmmm.domain.fund.entity.QStocksHeld;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenDto;
import com.beautifulyomin.mmmm.domain.member.dto.MyChildrenWaitingDto;
import com.beautifulyomin.mmmm.domain.member.dto.ParentWithBalanceDto;
import com.beautifulyomin.mmmm.domain.member.entity.QChildren;
import com.beautifulyomin.mmmm.domain.member.entity.QParent;
import com.beautifulyomin.mmmm.domain.member.entity.QParentAndChildren;
import com.beautifulyomin.mmmm.domain.stock.entity.QDailyStockChart;
import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

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
                .on(stocksHeld.stock.stockCode.eq(dailyStockChart.stockCode)
                        .and(dailyStockChart.date.eq(
                                JPAExpressions.select(dailyStockChart.date.max())
                                        .from(dailyStockChart)
                                        .where(dailyStockChart.stockCode.eq(stocksHeld.stock.stockCode)) // 동일한 stockCode에 대해
                        ))
                )
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

    @Override
    @Transactional
    public long updateSettingMoneyById(Integer childrenId, Integer settingMoney) {
        QChildren children = QChildren.children;
        return jpaQueryFactory
                .update(children)
                .set(children.settingMoney,settingMoney)
                .where(children.childrenId.eq(childrenId))
                .execute();
    }

    //자식 한명 조회
    @Override
    public MyChildDto findAllMyChildByChildrenId(Integer childrenId) {
        QChildren children = QChildren.children;
        QStocksHeld stocksHeld = QStocksHeld.stocksHeld;
        QDailyStockChart dailyStockChart = QDailyStockChart.dailyStockChart;


        BigDecimal totalAmount = jpaQueryFactory
                .select(stocksHeld.remainSharesCount.multiply(dailyStockChart.closingPrice).sum())
                .from(stocksHeld)
                .join(dailyStockChart)
                .on(stocksHeld.stock.stockCode.eq(dailyStockChart.stockCode)
                        .and(dailyStockChart.date.eq(
                                JPAExpressions.select(dailyStockChart.date.max())
                                        .from(dailyStockChart)
                                        .where(dailyStockChart.stockCode.eq(stocksHeld.stock.stockCode)) // 동일한 stockCode에 대해
                        ))
                )
                .where(stocksHeld.children.childrenId.eq(childrenId))
                .fetchOne();

        return jpaQueryFactory
                .select(Projections.constructor(MyChildDto.class,
                        children.childrenId,
                        children.userId,
                        children.name,
                        children.profileImgUrl,
                        children.money,
                        children.withdrawableMoney,
                        ConstantImpl.create(totalAmount != null ? totalAmount : BigDecimal.ZERO),
                        children.settingMoney,
                        children.settingWithdrawableMoney,
                        children.settingQuizBonusMoney,
                        children.accountNumber,
                        children.createdAt
                ))
                .from(children)
                .where(children.childrenId.eq(childrenId))
                .fetchOne();
    }

    @Override
    @Transactional
    public long updateSettingWithdrawableMoneyById(Integer childrenId, Integer settingWithdrawableMoney) {
        QChildren children = QChildren.children;
        //settiing 출가금 변경
        return jpaQueryFactory
                .update(children)
                .set(children.settingWithdrawableMoney, settingWithdrawableMoney)
                .where(children.childrenId.eq(childrenId))
                .execute();

    }

    @Override
    @Transactional
    public long setWithdrawableMoneyById(Integer childrenId, Integer settingWithdrawableMoney) {
        QChildren children = QChildren.children;
        // 출가금 변경
        return jpaQueryFactory
                .update(children)
                .set(children.withdrawableMoney,settingWithdrawableMoney)
                .where(children.childrenId.eq(childrenId))
                .execute();
    }



    @Override
    @Transactional
    public long updateSettingQuizBonusMoneyById(Integer childrenId, Integer settingQuizBonusMoney) {
        QChildren children = QChildren.children;
        return jpaQueryFactory
                .update(children)
                .set(children.settingQuizBonusMoney,settingQuizBonusMoney)
                .where(children.childrenId.eq(childrenId))
                .execute();
    }

    @Override
    @Transactional
    public long updateBalance(String parentUserId, Integer amount) {
        QParent parent = QParent.parent;
        return jpaQueryFactory
                .update(parent)
                .set(parent.balance, parent.balance.add(amount))
                .where(parent.userId.eq(parentUserId))
                .execute();
    }

    @Override
    @Transactional
    public long updateChildAccount(String childUserId, String accountNumber, String bankCode) {
        QChildren child = QChildren.children;
        return jpaQueryFactory
                .update(child)
                .set(child.accountNumber, accountNumber)
                .set(child.bankCode, bankCode)
                .where(child.userId.eq(childUserId))
                .execute();
    }

    @Override
    public List<ParentWithBalanceDto> getParentIdAndBalanceList() {
        QParent parent = QParent.parent;
        return jpaQueryFactory
                .select(Projections.constructor(ParentWithBalanceDto.class,
                        parent.parentId,parent.balance))
                .from(parent)
                .fetch();
    }

    @Override
    @Transactional
    public long updateParentAccount(String parentUserId, String accountNumber, String bankCode) {
        QParent parent = QParent.parent;
        return jpaQueryFactory
                .update(parent)
                .set(parent.accountNumber, accountNumber)
                .set(parent.bankCode, bankCode)
                .where(parent.userId.eq(parentUserId))
                .execute();
    }

}