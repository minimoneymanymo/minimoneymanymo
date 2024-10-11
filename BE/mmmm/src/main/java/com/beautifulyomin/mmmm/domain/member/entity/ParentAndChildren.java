package com.beautifulyomin.mmmm.domain.member.entity;

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
    @OneToOne
    @JoinColumn(name = "child_id", referencedColumnName = "childrenId", nullable = false)
    private Children child;

    @Column(nullable = false)
    private boolean isApproved = false;

    public ParentAndChildren(Parent parent, Children child, boolean isApproved) {
        this.parent = parent;
        this.child = child;
        this.isApproved = isApproved;
    }
}