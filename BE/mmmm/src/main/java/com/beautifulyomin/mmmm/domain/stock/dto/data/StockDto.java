package com.beautifulyomin.mmmm.domain.stock.dto.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@AllArgsConstructor
@Getter
@Builder
public class StockDto {
    private String stockCode;
    private String companyName;
    private String industry;
    private String mainProducts;
    private Date listingDate;
    private Integer settlementMonth;
    private String ceoName;
    private String website;
    private String region;
    private String marketName;
    private String faceValue;
    private String currencyName;
}
