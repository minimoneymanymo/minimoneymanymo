package com.beautifulyomin.mmmm.domain.stock.entity;

import com.beautifulyomin.mmmm.domain.member.entity.Children;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "stock_likes")
public class StockLikes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "children_id", referencedColumnName = "childrenId", nullable = false)
    private Children children;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_code", referencedColumnName = "stockCode", nullable = false)
    private Stock stock;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
