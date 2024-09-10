package com.beautifulyomin.mmmm.domain.stock.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockDto {
    @NotNull
    private String stockCode;




}
