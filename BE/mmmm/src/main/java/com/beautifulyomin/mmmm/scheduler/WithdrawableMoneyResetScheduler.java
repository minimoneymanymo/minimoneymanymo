package com.beautifulyomin.mmmm.scheduler;

import com.beautifulyomin.mmmm.domain.fund.service.FundService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class WithdrawableMoneyResetScheduler {

    private final FundService fundService;

    public WithdrawableMoneyResetScheduler(FundService fundService) {
        this.fundService = fundService;
    }

    @Scheduled(cron = "0 0 0 1 * ?")
    public void resetWithdrawableMoney() {
        fundService.updatewmMonthly();
    }
}
