package com.beautifulyomin.mmmm.domain.member.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "children")
@Data
@NoArgsConstructor
public class Children {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer childrenId;

    @Column(nullable = false, length = 100)
    private String userId;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 100)
    private String phoneNumber;

    @Column(length = 30)
    private String accountNumber;

    @Column(length = 3)
    private String bankCode;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer money = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean isDeleted = false;

    @Column(length = 255)
    private String profileImgUrl;

    @Column(length = 14)
    private String birthDay;

    @Column(nullable = false)
    private Integer withdrawableMoney = 0;
    @Column(nullable = false)
    private Integer settingWithdrawableMoney = 0;
    @Column(nullable = false)
    private Integer settingMoney = 0;
    @Column(nullable = false)
    private Integer settingQuizBonusMoney = 0;



    public Children(String userId, String name, String password, String phoneNumber, String birthDay) {
        this.userId = userId;
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.password = password;
        this.birthDay = birthDay;

    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
