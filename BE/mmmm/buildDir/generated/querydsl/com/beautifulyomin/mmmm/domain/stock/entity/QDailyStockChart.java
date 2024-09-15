package com.beautifulyomin.mmmm.domain.stock.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDailyStockChart is a Querydsl query type for DailyStockChart
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDailyStockChart extends EntityPathBase<DailyStockChart> {

    private static final long serialVersionUID = 1561087200L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDailyStockChart dailyStockChart = new QDailyStockChart("dailyStockChart");

    public final NumberPath<java.math.BigDecimal> closingPrice = createNumber("closingPrice", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> highestPrice = createNumber("highestPrice", java.math.BigDecimal.class);

    public final com.beautifulyomin.mmmm.domain.stock.entity.key.QDailyStockDataId id;

    public final NumberPath<java.math.BigDecimal> lowestPrice = createNumber("lowestPrice", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> operatingPrice = createNumber("operatingPrice", java.math.BigDecimal.class);

    public final NumberPath<Long> tradingVolume = createNumber("tradingVolume", Long.class);

    public QDailyStockChart(String variable) {
        this(DailyStockChart.class, forVariable(variable), INITS);
    }

    public QDailyStockChart(Path<? extends DailyStockChart> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDailyStockChart(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDailyStockChart(PathMetadata metadata, PathInits inits) {
        this(DailyStockChart.class, metadata, inits);
    }

    public QDailyStockChart(Class<? extends DailyStockChart> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.id = inits.isInitialized("id") ? new com.beautifulyomin.mmmm.domain.stock.entity.key.QDailyStockDataId(forProperty("id")) : null;
    }

}

