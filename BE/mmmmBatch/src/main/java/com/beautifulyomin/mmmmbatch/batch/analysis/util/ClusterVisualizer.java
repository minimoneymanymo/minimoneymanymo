package com.beautifulyomin.mmmmbatch.batch.analysis.util;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster.InvestorPoint;
import org.apache.commons.math3.linear.*;
import org.apache.commons.math3.stat.correlation.Covariance;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.xy.XYSeries;
import org.jfree.data.xy.XYSeriesCollection;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Component
public class ClusterVisualizer {

    public void visualizeWithPCA(List<List<InvestorPoint>> clusters, String fileName) {
        // 모든 포인트를 하나의 행렬로 변환
        List<double[]> allPoints = clusters.stream()
                .flatMap(List::stream)
                .map(InvestorPoint::getPoint)
                .toList();

        RealMatrix data = new Array2DRowRealMatrix(allPoints.toArray(new double[0][]));

        // PCA 수행
        RealMatrix covarianceMatrix = new Covariance(data).getCovarianceMatrix();
        EigenDecomposition decomposition = new EigenDecomposition(covarianceMatrix);

        // 상위 2개의 주성분 선택
        RealMatrix principalComponents = decomposition.getV().getSubMatrix(0, 4, 0, 1);

        // 데이터를 주성분으로 변환
        RealMatrix transformedData = data.multiply(principalComponents);

        // 시각화
        XYSeriesCollection dataset = new XYSeriesCollection();
        int pointIndex = 0;

        for (int i = 0; i < clusters.size(); i++) {
            XYSeries series = new XYSeries("Cluster " + i);
            for (int j = 0; j < clusters.get(i).size(); j++) {
                double[] coordinates = transformedData.getRow(pointIndex++);
                series.add(coordinates[0], coordinates[1]);
            }
            dataset.addSeries(series);
        }

        JFreeChart chart = ChartFactory.createScatterPlot(
                "Investor Clusters (PCA)",
                "First Principal Component",
                "Second Principal Component",
                dataset,
                PlotOrientation.VERTICAL,
                true,
                true,
                false
        );

        try {
            ChartUtils.saveChartAsPNG(new File(fileName), chart, 800, 600);
        } catch (IOException e) {
            throw new RuntimeException("Error saving cluster visualization", e);
        }
    }
}