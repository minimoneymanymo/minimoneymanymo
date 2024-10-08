package com.beautifulyomin.mmmmbatch.batch.analysis.constant;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum InvestmentType {
    TURTLE("느긋한 거북이", 1),
    PHONEIX("화끈한 불사조", 2),
    LION("모험심 가득한 사자", 3),
    SPROUT("성장하는 새싹", 4),
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
