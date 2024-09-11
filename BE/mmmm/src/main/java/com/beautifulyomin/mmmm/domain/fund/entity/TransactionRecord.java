package com.beautifulyomin.mmmm.domain.fund.entity;

import com.beautifulyomin.mmmm.domain.member.entity.Children;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "transaction_records")
@Getter
@Setter
@NoArgsConstructor
public class TransactionRecord {

    @ManyToOne(fetch = FetchType.LAZY) // 자식1 : 내역n
    @JoinColumn(name = "children_id", nullable = false)
    private Children children; // 비식별 관계 설정을 위한 참조 필드

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transactionId;

    @Column(nullable = false, length = 14)
    private String createdAt;

    @Column(length = 14)
    private String approvedAt;

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false, length = 1)
    private String tradeType;

    @Column(nullable = false)
    private Integer remainAmount;

    public TransactionRecord(Children children, String createdAt, String approvedAt, Integer amount, String tradeType, Integer remainAmount) {
        this.children = children;
        this.createdAt = createdAt;
        this.approvedAt = approvedAt;
        this.amount = amount;
        this.tradeType = tradeType;
        this.remainAmount = remainAmount;
    }

    @PrePersist
    protected void onCreate() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        this.createdAt = LocalDateTime.now().format(formatter);
    }
}
