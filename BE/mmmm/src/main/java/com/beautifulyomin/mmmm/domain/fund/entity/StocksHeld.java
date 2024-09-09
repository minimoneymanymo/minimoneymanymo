package com.beautifulyomin.mmmm.domain.fund.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "stocks_held")
@IdClass(ChildrenAndStockId.class)
@Getter
@Setter
@NoArgsConstructor
public class StocksHeld {

}
