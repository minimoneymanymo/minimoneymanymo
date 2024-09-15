package com.beautifulyomin.mmmm.domain.member.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QChildren is a Querydsl query type for Children
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QChildren extends EntityPathBase<Children> {

    private static final long serialVersionUID = 1422203848L;

    public static final QChildren children = new QChildren("children");

    public final StringPath accountNumber = createString("accountNumber");

    public final StringPath bankCode = createString("bankCode");

    public final StringPath birthDay = createString("birthDay");

    public final NumberPath<Integer> childrenId = createNumber("childrenId", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final BooleanPath isDeleted = createBoolean("isDeleted");

    public final NumberPath<Integer> money = createNumber("money", Integer.class);

    public final StringPath name = createString("name");

    public final StringPath password = createString("password");

    public final StringPath phoneNumber = createString("phoneNumber");

    public final StringPath profileImgUrl = createString("profileImgUrl");

    public final NumberPath<Integer> settingMoney = createNumber("settingMoney", Integer.class);

    public final NumberPath<Integer> settingQuizBonusMoney = createNumber("settingQuizBonusMoney", Integer.class);

    public final NumberPath<Integer> settingWithdrawableMoney = createNumber("settingWithdrawableMoney", Integer.class);

    public final StringPath userId = createString("userId");

    public final NumberPath<Integer> withdrawableMoney = createNumber("withdrawableMoney", Integer.class);

    public QChildren(String variable) {
        super(Children.class, forVariable(variable));
    }

    public QChildren(Path<? extends Children> path) {
        super(path.getType(), path.getMetadata());
    }

    public QChildren(PathMetadata metadata) {
        super(Children.class, metadata);
    }

}

