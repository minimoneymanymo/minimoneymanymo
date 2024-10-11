package com.beautifulyomin.mmmm.domain.stock.dto.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class StockDto  implements Serializable {
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
    private boolean isFavorite;
}
