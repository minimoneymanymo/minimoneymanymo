package com.beautifulyomin.mmmm.member.entity;

import java.io.Serializable;
import java.util.Objects;

// 복합 키 클래스
public class ParentAndChildrenId implements Serializable {

    private Integer parent;
    private Integer child;

    public ParentAndChildrenId() {
    }

    public ParentAndChildrenId(Integer parent, Integer child) {
        this.parent = parent;
        this.child = child;
    }

    // hashCode와 equals는 반드시 구현해야 합니다.
    @Override
    public int hashCode() {
        return Objects.hash(parent, child);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ParentAndChildrenId that = (ParentAndChildrenId) o;
        return Objects.equals(parent, that.parent) && Objects.equals(child, that.child);
    }
}
