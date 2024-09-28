package com.beautifulyomin.mmmmbatch.batch.analysis.step;

import com.beautifulyomin.mmmmbatch.batch.analysis.entity.Children;
import com.beautifulyomin.mmmmbatch.batch.analysis.repository.ChildrenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.annotation.BeforeStep;
import org.springframework.batch.item.ItemReader;
import org.springframework.stereotype.Component;

import java.util.Iterator;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvestmentAnalysisReader implements ItemReader<Children> {
    private final ChildrenRepository childrenRepository;
    private Iterator<Children> childrenIterator;

    @BeforeStep
    public void beforeStep() {
        childrenIterator = childrenRepository.findAll().iterator();
    }

    @Override
    public Children read() {
        log.info("🔥🔥🔥InvestmentAnalysisReader");
        if (childrenIterator.hasNext()) {
            return childrenIterator.next();
        }
        return null;
    }
}
