package com.beautifulyomin.mmmmbatch.batch.analysis.step.cluster;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster.InvestorPoint;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestmentReport;
import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestorCluster;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.InvestmentAnalysisRepository;
import com.beautifulyomin.mmmmbatch.batch.analysis.service.ClusterAnalysisService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.math3.ml.clustering.CentroidCluster;
import org.apache.commons.math3.ml.clustering.KMeansPlusPlusClusterer;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvestorClusterProcessor implements ItemProcessor<InvestmentReport, InvestorCluster> {

    private final InvestmentAnalysisRepository investmentAnalysisRepository;
    private final int CLUSTER_CNT = 4;

    private KMeansPlusPlusClusterer<InvestorPoint> clusterer;
    private List<CentroidCluster<InvestorPoint>> clusters;
    private final ClusterAnalysisService clusterAnalysisService;

    @PostConstruct
    public void initializeClusterer() {
//        log.info("Initializing clusterer...");
//        LocalDate date = LocalDate.now();
//        List<InvestmentReport> allReports = investmentAnalysisRepository.findAllByDate(date);
//
//        log.info("❕❕❕통계 날짜 = {}", date);
//        List<InvestorPoint> points = allReports.stream()
//                .map(InvestorPoint::new)
//                .toList();
//
//        clusterer = new KMeansPlusPlusClusterer<>(CLUSTER_CNT, 1000);
//        clusters = clusterer.cluster(points);
//        log.info("Clusterer initialized with {} clusters", clusters.size());
//        clusterAnalysisService.visualizeClusters(clusters, CLUSTER_CNT, date);
    }


    @Override
    public InvestorCluster process(InvestmentReport item) throws Exception {
        log.debug("🔥🔥🔥Processing InvestmentReport: childrenId={}, date={}", item.getChildrenId(), item.getDate());

        InvestorPoint point = new InvestorPoint(item);
        int clusterId = findClusterId(point);

        InvestorCluster cluster = InvestorCluster.builder()
                .childrenId(item.getChildrenId())
                .date(item.getDate())
                .clusterId(clusterId)
                .build();

        log.debug("🌠Assigned to cluster: {}", clusterId);
        return cluster;
    }

    private int findClusterId(InvestorPoint point) {
        double minDistance = Double.MAX_VALUE;
        int closestClusterId = -1;

        for (int i = 0; i < clusters.size(); i++) {
            double distance = calculateDistance(point.getPoint(), clusters.get(i).getCenter().getPoint());
            if (distance < minDistance) {
                minDistance = distance;
                closestClusterId = i;
            }
        }

        return closestClusterId;
    }

    private double calculateDistance(double[] point1, double[] point2) {
        double sum = 0;
        for (int i = 0; i < point1.length; i++) {
            sum += Math.pow(point1[i] - point2[i], 2);
        }
        return Math.sqrt(sum);
    }
}
