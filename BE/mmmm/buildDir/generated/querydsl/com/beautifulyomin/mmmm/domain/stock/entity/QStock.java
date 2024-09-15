package com.beautifulyomin.mmmm.domain.stock.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QStock is a Querydsl query type for Stock
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStock extends EntityPathBase<Stock> {

    private static final long serialVersionUID = 816458069L;

    public static final QStock stock = new QStock("stock");

    public final StringPath ceoName = createString("ceoName");

    public final StringPath companyName = createString("companyName");

    public final StringPath currencyName = createString("currencyName");

    public final StringPath faceValue = createString("faceValue");

    public final StringPath industry = createString("industry");

    public final DateTimePath<java.util.Date> listingDate = createDateTime("listingDate", java.util.Date.class);

    public final StringPath mainProducts = createString("mainProducts");

    public final StringPath marketName = createString("marketName");

    public final StringPath region = createString("region");

    public final NumberPath<Integer> settlementMonth = createNumber("settlementMonth", Integer.class);

    public final StringPath stockCode = createString("stockCode");

    public final StringPath website = createString("website");

    public QStock(String variable) {
        super(Stock.class, forVariable(variable));
    }

    public QStock(Path<? extends Stock> path) {
        super(path.getType(), path.getMetadata());
    }

    public QStock(PathMetadata metadata) {
        super(Stock.class, metadata);
    }

}

