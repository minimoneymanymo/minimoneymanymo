package com.beautifulyomin.mmmm.member.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "parent_and_children")
@IdClass(ParentAndChildrenId.class)  // 복합 키 클래스 지정
@Data
@NoArgsConstructor
public class ParentAndChildren {

    @Id
    @ManyToOne
    @JoinColumn(name = "parent_id", referencedColumnName = "parentId", nullable = false)
    private Parent parent; // referencedColumnName은 조회하는 클래스entity pk이름으로

    @Id
    @ManyToOne
    @JoinColumn(name = "child_id", referencedColumnName = "childrenId", nullable = false)
    private Children child;

    @Column(nullable = false)
    private Boolean isApproved = false;

    public ParentAndChildren(Parent parent, Children child, Boolean isApproved) {
        this.parent = parent;
        this.child = child;
        this.isApproved = isApproved;
    }
}