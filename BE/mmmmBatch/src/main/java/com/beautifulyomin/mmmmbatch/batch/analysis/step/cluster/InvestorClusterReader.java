package com.beautifulyomin.mmmmbatch.batch.analysis.step.cluster;

import com.beautifulyomin.mmmmbatch.batch.analysis.data.cluster.InvestorData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.*;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class InvestorClusterReader  implements ItemReader<InvestorData> {
    @Override
    public InvestorData read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
        return null;
    }
}
