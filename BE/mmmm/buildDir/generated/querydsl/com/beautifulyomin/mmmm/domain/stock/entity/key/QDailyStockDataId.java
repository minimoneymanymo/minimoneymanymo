package com.beautifulyomin.mmmm.domain.stock.entity.key;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QDailyStockDataId is a Querydsl query type for DailyStockDataId
 */
@Generated("com.querydsl.codegen.DefaultEmbeddableSerializer")
public class QDailyStockDataId extends BeanPath<DailyStockDataId> {

    private static final long serialVersionUID = -1528510254L;

    public static final QDailyStockDataId dailyStockDataId = new QDailyStockDataId("dailyStockDataId");

    public final DatePath<java.time.LocalDate> date = createDate("date", java.time.LocalDate.class);

    public final StringPath stockCode = createString("stockCode");

    public QDailyStockDataId(String variable) {
        super(DailyStockDataId.class, forVariable(variable));
    }

    public QDailyStockDataId(Path<? extends DailyStockDataId> path) {
        super(path.getType(), path.getMetadata());
    }

    public QDailyStockDataId(PathMetadata metadata) {
        super(DailyStockDataId.class, metadata);
    }

}

