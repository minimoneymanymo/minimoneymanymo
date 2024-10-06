package com.beautifulyomin.mmmm.simulation.data;

import lombok.Data;

import java.time.LocalDate;
import java.util.*;

@Data
public class SimulationInvestor {
    private int id;
    private double money;
    private Map<String, Integer> stockHoldings; // 주식코드, 보유 수량
    private Map<String, Double> characteristics; // 특성 가중치
    private Map<String, List<Transaction>> transactions; // 주식코드, 거래 내역 리스트

    public SimulationInvestor(int id, int initialMoney, Map<String, Double> characteristics) {
        this.id = id;
        this.money = initialMoney;
        this.characteristics = characteristics;
        this.stockHoldings = new HashMap<>();
        this.transactions = new HashMap<>();
    }

    public void addTransaction(String stockCode, boolean isBuy, int quantity, double price, LocalDate date) {
        transactions.computeIfAbsent(stockCode, k -> new ArrayList<>())
                .add(new Transaction(isBuy, quantity, price, date));

        if (isBuy) {
            stockHoldings.merge(stockCode, quantity, Integer::sum);
        } else {
            stockHoldings.merge(stockCode, -quantity, Integer::sum);
        }
    }

    public double getAverageBuyPrice(String stockCode) {
        List<Transaction> stockTransactions = transactions.get(stockCode);
        if (stockTransactions == null || stockTransactions.isEmpty()) {
            return 0.0;
        }

        double totalCost = 0.0;
        int totalQuantity = 0;

        for (Transaction t : stockTransactions) {
            if (t.isBuy) {
                totalCost += t.price * t.quantity;
                totalQuantity += t.quantity;
            }
        }

        return totalQuantity > 0 ? totalCost / totalQuantity : 0.0;
    }

    public int calculateHoldingPeriod(String stockCode, LocalDate currentDate) {
        List<Transaction> stockTransactions = transactions.get(stockCode);
        if (stockTransactions == null || stockTransactions.isEmpty()) {
            return 0;
        }

        LocalDate firstBuyDate = stockTransactions.stream()
                .filter(t -> t.isBuy)
                .map(t -> t.date)
                .min(LocalDate::compareTo)
                .orElse(currentDate);

        return (int) java.time.temporal.ChronoUnit.DAYS.between(firstBuyDate, currentDate);
    }

    @Data
    private static class Transaction {
        private final boolean isBuy;
        private final int quantity;
        private final double price;
        private final LocalDate date;
    }
}
