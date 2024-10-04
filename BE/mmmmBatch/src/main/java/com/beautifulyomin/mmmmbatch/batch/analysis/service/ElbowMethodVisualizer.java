package com.beautifulyomin.mmmmbatch.batch.analysis.service;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster.InvestorPoint;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReport;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.InvestmentAnalysisRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.math3.ml.clustering.CentroidCluster;
import org.apache.commons.math3.ml.clustering.KMeansPlusPlusClusterer;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.data.category.DefaultCategoryDataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
public class ElbowMethodVisualizer {

    private final InvestmentAnalysisRepository investmentAnalysisRepository;

    @Autowired
    public ElbowMethodVisualizer(InvestmentAnalysisRepository investmentAnalysisRepository) {
        this.investmentAnalysisRepository = investmentAnalysisRepository;
    }

    public void findOptimalClusterCountAndVisualize() {
        log.info("엘보우 시각화 시작!!!!!⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐");
        LocalDate date = LocalDate.now(); // 분석할 날짜 설정
        List<InvestmentReport> allReports = investmentAnalysisRepository.findAllByDate(date);
        List<InvestorPoint> points = allReports.stream()
                .map(InvestorPoint::new)
                .toList();

        List<Double> wcssValues = new ArrayList<>(); // WCSS 값을 저장할 리스트

        for (int k = 1; k <= 10; k++) { // 클러스터 개수를 1~10까지 실험
            KMeansPlusPlusClusterer<InvestorPoint> clusterer = new KMeansPlusPlusClusterer<>(k, 1000);
            List<CentroidCluster<InvestorPoint>> clusters = clusterer.cluster(points);

            double wcss = calculateWCSS(clusters); // WCSS 계산
            wcssValues.add(wcss);
        }

        // WCSS 값을 시각화하여 파일로 저장
        plotWCSS(wcssValues);
    }

    private double calculateWCSS(List<CentroidCluster<InvestorPoint>> clusters) {
        double wcss = 0.0;

        for (CentroidCluster<InvestorPoint> cluster : clusters) {
            double[] center = cluster.getCenter().getPoint();

            for (InvestorPoint point : cluster.getPoints()) {
                wcss += calculateDistance(center, point.getPoint());
            }
        }
        return wcss;
    }

    private double calculateDistance(double[] point1, double[] point2) {
        double sum = 0.0;
        for (int i = 0; i < point1.length; i++) {
            sum += Math.pow(point1[i] - point2[i], 2);
        }
        return Math.sqrt(sum);
    }

    // WCSS 값을 바탕으로 시각화 및 파일 저장
    private void plotWCSS(List<Double> wcssValues) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        for (int i = 1; i <= wcssValues.size(); i++) {
            dataset.addValue(wcssValues.get(i - 1), "WCSS", Integer.toString(i));
        }

        // 그래프 생성
        JFreeChart lineChart = ChartFactory.createLineChart(
                "Elbow Method for Optimal Cluster Count",
                "Number of Clusters",
                "WCSS",
                dataset
        );

        // 이미지 파일로 저장
        try {
            ChartUtils.saveChartAsPNG(new File("./elbow_method_chart.png"), lineChart, 800, 600);
            System.out.println("엘보우 기법 시각화 파일 저장 완료: elbow_method_chart.png");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}