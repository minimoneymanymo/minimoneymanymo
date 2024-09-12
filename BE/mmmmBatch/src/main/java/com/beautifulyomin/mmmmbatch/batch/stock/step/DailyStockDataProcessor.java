package com.beautifulyomin.mmmmbatch.batch.stock.step;

import com.beautifulyomin.mmmmbatch.batch.stock.entity.DailyStockData;
import com.beautifulyomin.mmmmbatch.batch.stock.entity.key.DailyStockDataId;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;

@Slf4j
@Component
public class DailyStockDataProcessor implements ItemProcessor<String, DailyStockData> {

    private final RestTemplate restTemplate;

    @Value("${kis_current_price_api}")
    private String CURRENT_PRICE_API_URL;

    @Value("${kis_prod_appkey}")
    private String PROD_APPKEY;

    @Value("${kis_api_secret}")
    private String PROD_APPSECRET;

    @Value("${kis_api_token}")
    private String PROD_TOKEN;

    private static final LocalDate TODEY = LocalDate.now();

    public DailyStockDataProcessor(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public DailyStockData process(String stockCode) throws Exception {
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
        headers.set("authorization", "Bearer " + PROD_TOKEN);
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

        // API 응답을 DailyStockData 엔티티로 변환
        DailyStockData stockData = new DailyStockData();

        //초당 호출 제한 방지
        Thread.sleep(1000);

        DailyStockDataId id = DailyStockDataId.builder()
                .stockCode(stockCode)
                .date(LocalDate.now())
                .build();

        return DailyStockData.builder()
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
    }
}
