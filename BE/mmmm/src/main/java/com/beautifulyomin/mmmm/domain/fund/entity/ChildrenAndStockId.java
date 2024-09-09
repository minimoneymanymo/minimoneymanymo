package com.beautifulyomin.mmmm.domain.fund.entity;

import java.io.Serializable;
import java.util.Objects;

// 복합키 클래스
public class ChildrenAndStockId implements Serializable {
    private Integer childrenId;
    private String stockCode;

    // 기본 생성자
    public ChildrenAndStockId() {}

    // 생성자
    public ChildrenAndStockId(Integer childrenId, String stockCode) {
        this.childrenId = childrenId;
        this.stockCode = stockCode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChildrenAndStockId that = (ChildrenAndStockId) o;
        return Objects.equals(childrenId, that.childrenId) &&
                Objects.equals(stockCode, that.stockCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(childrenId, stockCode);
    }
}

