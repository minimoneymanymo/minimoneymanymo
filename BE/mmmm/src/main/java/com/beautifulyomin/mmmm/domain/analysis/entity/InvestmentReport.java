package com.beautifulyomin.mmmm.domain.analysis.entity;

import com.beautifulyomin.mmmm.domain.analysis.entity.key.InvestmentReportId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Range;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@IdClass(InvestmentReportId.class)
@Table(indexes = {
        @Index(name = "idx_investment_report_date", columnList = "date"),
        @Index(name = "idx_investment_report_children_id", columnList = "childrenId")
})
public class InvestmentReport {

    @Id
    @Column(nullable = false)
    private LocalDate date;

    @Id
    @Column(nullable = false)
    private Integer childrenId;

    @Column(nullable = false)
    @Range(min = 0, max = 100)
    private Integer tradingFrequency;

    @Column(precision = 5, scale = 2)
    @Range(min = 0, max = 100)
    private BigDecimal cashRatio;

    @Column(precision = 5, scale = 2)
    @Range(min = 0, max = 100)
    private BigDecimal winLossRatio;

    @Column(precision = 5, scale = 2)
    @Range(min = 0, max = 100)
    private Integer diversification;

    @Column(nullable = false)
    @Range(min = 0, max = 100)
    private Integer stability;


}
