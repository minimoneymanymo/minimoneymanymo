package com.beautifulyomin.mmmmbatch.batch.analysis.entity.key;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestmentReportId implements Serializable {
    @Column(nullable = false)
    private LocalDate date;
    @Column(nullable = false)
    private Integer childrenId;
}
