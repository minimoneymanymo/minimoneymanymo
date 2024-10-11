package com.beautifulyomin.mmmmbatch.batch.analysis.constant;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum InvestmentType {
    TURTLE("느긋한 거북이", 1),
    SPROUT ("성장하는 새싹", 2),
    WALRUS ("신중한 바다 코끼리", 3),
    CHEETAH ("빠른 치타", 4),
    PHOENIX  ("화끈한 불사조", 5),
    NONE("없음", 0);

    private final String label;
    private final int value;

    InvestmentType(String label, int value) {
        this.label = label;
        this.value = value;
    }

    public static InvestmentType fromLabel(int value) {
        return Arrays.stream(InvestmentType.values())
                .filter(investmentType -> investmentType.value == value)
                .findFirst()
                .orElse(NONE);
    }

}
