package com.beautifulyomin.mmmmbatch.batch.analysis.step.cluster;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.InvestorCluster;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.InvestorClusterRepository;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

@Slf4j
@AllArgsConstructor
@Component
public class InvestorClusterWriter implements ItemWriter<InvestorCluster> {

    private final InvestorClusterRepository repository;

    @Override
    public void write(Chunk<? extends InvestorCluster> items) throws Exception {
        log.debug("🔥🔥🔥Writing {} InvestorClusters", items.size());
        repository.saveAll(items);
        log.debug("🌠Successfully wrote InvestorClusters");
    }

}

