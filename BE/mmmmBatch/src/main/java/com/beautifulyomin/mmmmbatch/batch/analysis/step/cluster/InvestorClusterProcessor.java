package com.beautifulyomin.mmmmbatch.batch.analysis.step.cluster;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster.InvestorCluster;
import com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster.InvestorData;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

@Component
public class InvestorClusterProcessor implements ItemProcessor<InvestorData, InvestorCluster> {
    @Override
    public InvestorCluster process(InvestorData item) throws Exception {
        return null;
    }
}
