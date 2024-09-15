package com.beautifulyomin.mmmm.domain.fund.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTradeRecord is a Querydsl query type for TradeRecord
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTradeRecord extends EntityPathBase<TradeRecord> {

    private static final long serialVersionUID = -485188127L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTradeRecord tradeRecord = new QTradeRecord("tradeRecord");

    public final NumberPath<Integer> amount = createNumber("amount", Integer.class);

    public final com.beautifulyomin.mmmm.domain.member.entity.QChildren children;

    public final StringPath createdAt = createString("createdAt");

    public final StringPath reason = createString("reason");

    public final NumberPath<Integer> reasonBonusMoney = createNumber("reasonBonusMoney", Integer.class);

    public final NumberPath<Integer> remainAmount = createNumber("remainAmount", Integer.class);

    public final com.beautifulyomin.mmmm.domain.stock.entity.QStock stock;

    public final NumberPath<java.math.BigDecimal> stockTradingGain = createNumber("stockTradingGain", java.math.BigDecimal.class);

    public final NumberPath<Integer> tradeRecordId = createNumber("tradeRecordId", Integer.class);

    public final NumberPath<java.math.BigDecimal> tradeSharesCount = createNumber("tradeSharesCount", java.math.BigDecimal.class);

    public final StringPath tradeType = createString("tradeType");

    public QTradeRecord(String variable) {
        this(TradeRecord.class, forVariable(variable), INITS);
    }

    public QTradeRecord(Path<? extends TradeRecord> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTradeRecord(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTradeRecord(PathMetadata metadata, PathInits inits) {
        this(TradeRecord.class, metadata, inits);
    }

    public QTradeRecord(Class<? extends TradeRecord> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.children = inits.isInitialized("children") ? new com.beautifulyomin.mmmm.domain.member.entity.QChildren(forProperty("children")) : null;
        this.stock = inits.isInitialized("stock") ? new com.beautifulyomin.mmmm.domain.stock.entity.QStock(forProperty("stock")) : null;
    }

}

