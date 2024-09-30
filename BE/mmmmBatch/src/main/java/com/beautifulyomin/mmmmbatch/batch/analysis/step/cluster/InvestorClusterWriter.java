package com.beautifulyomin.mmmmbatch.batch.analysis.step.cluster;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster.InvestorCluster;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

@Component
public class InvestorClusterWriter implements ItemWriter<InvestorCluster> {

    @Override
    public void write(Chunk<? extends InvestorCluster> chunk) throws Exception {

    }
}
