package com.beautifulyomin.mmmmbatch.batch.step.dailyStock;

import com.beautifulyomin.mmmmbatch.batch.entity.DailyStockData;
import com.beautifulyomin.mmmmbatch.batch.entity.Stock52weekData;
import com.beautifulyomin.mmmmbatch.batch.step.TokenStore;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Slf4j
@Component
public class DailyStockDataProcessor implements ItemProcessor<String, Map<String, Object>> {

    private final RestTemplate restTemplate;
    private final TokenStore tokenStore;

    @Value("${kis_current_price_api}")
    private String CURRENT_PRICE_API_URL;

    @Value("${kis_prod_appkey}")
    private String PROD_APPKEY;

    @Value("${kis_api_secret}")
    private String PROD_APPSECRET;

    private static final LocalDate TODEY = LocalDate.now();

    public DailyStockDataProcessor(RestTemplate restTemplate, TokenStore tokenStore) {
        this.restTemplate = restTemplate;
        this.tokenStore = tokenStore;
    }

    @Override
    public Map<String, Object> process(String stockCode) throws Exception {
//        log.info("⭐⭐⭐⭐⭐⭐⭐process 진입");
        // API URL 구성
        URI uri = UriComponentsBuilder.fromUriString(CURRENT_PRICE_API_URL)
                .queryParam("fid_cond_mrkt_div_code", "J")
                .queryParam("fid_input_iscd", stockCode.trim())
                .encode()
                .build()
                .toUri();

        // API 호출을 위한 헤더 설정
        var headers = new org.springframework.http.HttpHeaders();
        headers.set("content-type", "application/json");
        headers.set("authorization", "Bearer " + tokenStore.getToken());
        headers.set("appkey", PROD_APPKEY);
        headers.set("appsecret", PROD_APPSECRET);
        headers.set("tr_id", "FHKST01010100");

        // HTTP 요청 생성
        var request = new org.springframework.http.HttpEntity<>(headers);

        // API 호출
        var response = restTemplate.exchange(uri, org.springframework.http.HttpMethod.GET, request, String.class);

        // 응답 처리
        JSONObject jsonResponse = new JSONObject(response.getBody());
        JSONObject output = jsonResponse.getJSONObject("output");

        //초당 호출 제한 방지
        Thread.sleep(1000);

        DailyStockData dailyStockData = DailyStockData.builder()
                .stockCode(stockCode)
                .date(TODEY)
                .marketCapitalization(output.getBigInteger("hts_avls"))
                .priceChangeSign(output.getString("prdy_vrss_sign"))
                .priceChange(output.getBigDecimal("prdy_vrss"))
                .priceChangeRate(output.getBigDecimal("prdy_ctrt"))
                .peRatio(output.getBigDecimal("per"))
                .pbRatio(output.getBigDecimal("pbr"))
                .earningsPerShare(output.getBigDecimal("eps"))
                .bookValuePerShare(output.getBigDecimal("bps"))
                .foreignNetBuyVolume(output.getString("pgtr_ntby_qty"))
                .htsForeignExhaustionRate(output.getBigDecimal("hts_frgn_ehrt"))
                .programNetBuyVolume(output.getString("pgtr_ntby_qty"))
                .tradingValue(output.getBigInteger("acml_tr_pbmn"))
                .volumeTurnoverRatio(output.getBigDecimal("vol_tnrt"))
                .outstandingShares(output.getBigInteger("lstn_stcn"))
                .build();


        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        Stock52weekData stock52weekData = Stock52weekData.builder()
                .stockCode(stockCode)
                .date(TODEY)
                .high52Week(output.getLong("w52_hgpr"))
                .high52WeekDate(LocalDate.parse(output.getString("w52_hgpr_date"),formatter))
                .low52Week(output.getLong("w52_lwpr"))
                .low52WeekDate(LocalDate.parse(output.getString("w52_lwpr_date"), formatter))
                .build();

        return Map.of("dailyStockData", dailyStockData, "stock52weekData", stock52weekData);
    }
}
