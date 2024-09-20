package com.beautifulyomin.mmmm.domain.stock.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "stocks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Stock {
    @Id
    @Column(nullable = false)
    private String stockCode;

    @Column(nullable = false, length = 100)
    private String companyName;

    @Column(length = 100)
    private String industry;

    @Column(columnDefinition = "TEXT")
    private String mainProducts;

    @Column(columnDefinition = "DATE")
    private Date listingDate;

    @Column
    private Integer settlementMonth;

    @Column(length = 100)
    private String ceoName;

    @Column(length = 255)
    private String website;

    @Column(length = 100)
    private String region;

    @Column(nullable = false, length = 40)
    private String marketName;

    @Column(nullable = false, length = 11)
    private String faceValue;

    @Column(nullable = false, length = 20)
    private String currencyName;
}
