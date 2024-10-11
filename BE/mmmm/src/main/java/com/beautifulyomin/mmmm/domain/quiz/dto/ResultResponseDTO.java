package com.beautifulyomin.mmmm.domain.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResultResponseDTO {
    private boolean result;
    private int bonusMoney;

}
