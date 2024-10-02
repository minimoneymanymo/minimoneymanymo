package com.beautifulyomin.mmmmbatch.batch.analysis.entity;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.key.InvestmentReportId;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "investor_clusters")
@IdClass(InvestmentReportId.class)
public class InvestorCluster {
    @Id
    private Integer childrenId;

    @Id
    private LocalDate date;

    private Integer clusterId;

    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "date", referencedColumnName = "date", insertable = false, updatable = false),
            @JoinColumn(name = "childrenId", referencedColumnName = "childrenId", insertable = false, updatable = false)
    })
    private InvestmentReport investmentReport;
}