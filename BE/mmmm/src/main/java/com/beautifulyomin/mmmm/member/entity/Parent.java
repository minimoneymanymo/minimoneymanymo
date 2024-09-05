package com.beautifulyomin.mmmm.member.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "parents")
@Getter
@Setter
@NoArgsConstructor
public class Parent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer parentId;

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
    private Integer balance = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean isDeleted = false;

    @Column(nullable = false, length = 512)
    private String signedData;

    @Column(nullable = false, length = 88)
    private String ci;

    @Column(length = 255)
    private String profileImgUrl;

    public Parent(String userId, String name, String password, String phoneNumber, String signedData, String ci) {
        this.userId = userId;
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.password = password;
        this.signedData = signedData;
        this.ci = ci;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}