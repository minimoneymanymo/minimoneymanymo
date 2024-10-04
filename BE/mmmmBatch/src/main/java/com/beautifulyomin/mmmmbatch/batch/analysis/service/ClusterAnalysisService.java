package com.beautifulyomin.mmmmbatch.batch.analysis.service;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster.InvestorPoint;
import com.beautifulyomin.mmmmbatch.batch.analysis.util.ClusterVisualizer;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.math3.ml.clustering.CentroidCluster;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class ClusterAnalysisService {
    private final ClusterVisualizer clusterVisualizer;

    public void visualizeClusters(List<CentroidCluster<InvestorPoint>> clusters, int clusterCnt, LocalDate date) {
        List<List<InvestorPoint>> clusterPoints = clusters.stream()
                .map(CentroidCluster::getPoints)
                .toList();
        clusterVisualizer.visualizeWithPCA(clusterPoints, String.format("./investor_clusters_pca_%s_%d.png", date.toString(), clusterCnt));
        log.info("파일 등록 완료!!!");
    }

}
