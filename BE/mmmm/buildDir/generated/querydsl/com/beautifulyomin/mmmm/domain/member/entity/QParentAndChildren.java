package com.beautifulyomin.mmmm.domain.member.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QParentAndChildren is a Querydsl query type for ParentAndChildren
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QParentAndChildren extends EntityPathBase<ParentAndChildren> {

    private static final long serialVersionUID = 2085329475L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QParentAndChildren parentAndChildren = new QParentAndChildren("parentAndChildren");

    public final QChildren child;

    public final BooleanPath isApproved = createBoolean("isApproved");

    public final QParent parent;

    public QParentAndChildren(String variable) {
        this(ParentAndChildren.class, forVariable(variable), INITS);
    }

    public QParentAndChildren(Path<? extends ParentAndChildren> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QParentAndChildren(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QParentAndChildren(PathMetadata metadata, PathInits inits) {
        this(ParentAndChildren.class, metadata, inits);
    }

    public QParentAndChildren(Class<? extends ParentAndChildren> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.child = inits.isInitialized("child") ? new QChildren(forProperty("child")) : null;
        this.parent = inits.isInitialized("parent") ? new QParent(forProperty("parent")) : null;
    }

}

