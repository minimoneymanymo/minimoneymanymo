package com.beautifulyomin.mmmm.simulation.data;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class SimulationInvestor {
    private int id;
    private double money;
    private Map<String, Integer> stockHoldings; // 주식코드, 보유 수량
    private Map<String, Double> characteristics; // 특성 가중치

    public SimulationInvestor(int id, int initialMoney, Map<String, Double> characteristics) {
        this.id = id; //실제 DB 자식 PK
        this.money = initialMoney; //자본
        this.characteristics = characteristics;
        stockHoldings=new HashMap<>();
    }
}
