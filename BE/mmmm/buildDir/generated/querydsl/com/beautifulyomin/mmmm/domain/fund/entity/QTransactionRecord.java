package com.beautifulyomin.mmmm.domain.fund.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTransactionRecord is a Querydsl query type for TransactionRecord
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTransactionRecord extends EntityPathBase<TransactionRecord> {

    private static final long serialVersionUID = 1183089371L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTransactionRecord transactionRecord = new QTransactionRecord("transactionRecord");

    public final NumberPath<Integer> amount = createNumber("amount", Integer.class);

    public final StringPath approvedAt = createString("approvedAt");

    public final com.beautifulyomin.mmmm.domain.member.entity.QChildren children;

    public final StringPath createdAt = createString("createdAt");

    public final NumberPath<Integer> remainAmount = createNumber("remainAmount", Integer.class);

    public final StringPath tradeType = createString("tradeType");

    public final NumberPath<Integer> transactionId = createNumber("transactionId", Integer.class);

    public QTransactionRecord(String variable) {
        this(TransactionRecord.class, forVariable(variable), INITS);
    }

    public QTransactionRecord(Path<? extends TransactionRecord> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTransactionRecord(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTransactionRecord(PathMetadata metadata, PathInits inits) {
        this(TransactionRecord.class, metadata, inits);
    }

    public QTransactionRecord(Class<? extends TransactionRecord> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.children = inits.isInitialized("children") ? new com.beautifulyomin.mmmm.domain.member.entity.QChildren(forProperty("children")) : null;
    }

}

