package com.beautifulyomin.mmmm.domain.fund.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStocksHeld is a Querydsl query type for StocksHeld
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStocksHeld extends EntityPathBase<StocksHeld> {

    private static final long serialVersionUID = -1057105818L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStocksHeld stocksHeld = new QStocksHeld("stocksHeld");

    public final com.beautifulyomin.mmmm.domain.member.entity.QChildren children;

    public final NumberPath<java.math.BigDecimal> remainSharesCount = createNumber("remainSharesCount", java.math.BigDecimal.class);

    public final com.beautifulyomin.mmmm.domain.stock.entity.QStock stock;

    public final NumberPath<Integer> stocksHeldId = createNumber("stocksHeldId", Integer.class);

    public final NumberPath<Integer> totalAmount = createNumber("totalAmount", Integer.class);

    public QStocksHeld(String variable) {
        this(StocksHeld.class, forVariable(variable), INITS);
    }

    public QStocksHeld(Path<? extends StocksHeld> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStocksHeld(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStocksHeld(PathMetadata metadata, PathInits inits) {
        this(StocksHeld.class, metadata, inits);
    }

    public QStocksHeld(Class<? extends StocksHeld> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.children = inits.isInitialized("children") ? new com.beautifulyomin.mmmm.domain.member.entity.QChildren(forProperty("children")) : null;
        this.stock = inits.isInitialized("stock") ? new com.beautifulyomin.mmmm.domain.stock.entity.QStock(forProperty("stock")) : null;
    }

}

