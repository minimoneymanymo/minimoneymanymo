package com.beautifulyomin.mmmmbatch.batch.stock.step.dailyStock;

import com.beautifulyomin.mmmmbatch.batch.stock.entity.DailyStockChart;
import com.beautifulyomin.mmmmbatch.batch.stock.entity.DailyStockData;
import com.beautifulyomin.mmmmbatch.batch.stock.entity.Stock52weekData;
import com.beautifulyomin.mmmmbatch.batch.stock.step.TokenStore;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.http.HttpHeaders;
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
public class DailyStockProcessor implements ItemProcessor<String, Map<String, Object>> {

    private final RestTemplate restTemplate;
    private final TokenStore tokenStore;

    @Value("${kis_current_price_api}")
    private String CURRENT_PRICE_API_URL;

    @Value("${kis_prod_appkey}")
    private String PROD_APPKEY;

    @Value("${kis_api_secret}")
    private String PROD_APPSECRET;

//    private static final LocalDate YESTERDAY = LocalDate.now().minusDays(1);
    private static final LocalDate TODEY = LocalDate.now();

    public DailyStockProcessor(RestTemplate restTemplate, TokenStore tokenStore) {
        this.restTemplate = restTemplate;
        this.tokenStore = tokenStore;
    }

    @Override
    public Map<String, Object> process(@NonNull String stockCode) throws Exception {
        URI uri = getUri(stockCode);
        var headers = getHttpHeaders();
        var request = new org.springframework.http.HttpEntity<>(headers);
        var response = restTemplate.exchange(uri, org.springframework.http.HttpMethod.GET, request, String.class);

        JSONObject jsonResponse = new JSONObject(response.getBody());
        JSONObject output = jsonResponse.getJSONObject("output");

        Thread.sleep(500);

        DailyStockData dailyStockData = getDailyStockData(stockCode, output);
        Stock52weekData stock52weekData = getStock52weekData(stockCode, output);
        DailyStockChart dailyStockChart = getDailyStockChart(stockCode, output);

        return Map.of("dailyStockData", dailyStockData,
                "stock52weekData", stock52weekData,
                "dailyStockChart", dailyStockChart);
    }

    private URI getUri(String stockCode) {
        return UriComponentsBuilder.fromUriString(CURRENT_PRICE_API_URL)
                .queryParam("fid_cond_mrkt_div_code", "J")
                .queryParam("fid_input_iscd", stockCode.trim())
                .encode()
                .build()
                .toUri();
    }

    private HttpHeaders getHttpHeaders() {
        var headers = new HttpHeaders();
        headers.set("content-type", "application/json");
        headers.set("authorization", "Bearer " + tokenStore.getToken());
        headers.set("appkey", PROD_APPKEY);
        headers.set("appsecret", PROD_APPSECRET);
        headers.set("tr_id", "FHKST01010100");
        return headers;
    }

    private static DailyStockChart getDailyStockChart(String stockCode, JSONObject output) {
        return DailyStockChart.builder()
                .stockCode(stockCode)
                .date(TODEY)
                .closingPrice(output.getBigDecimal("stck_prpr")) //현재가==종가
                .lowestPrice(output.getBigDecimal("stck_lwpr"))
                .highestPrice(output.getBigDecimal("stck_hgpr"))
                .operatingPrice(output.getBigDecimal("stck_oprc"))
                .tradingVolume(output.getLong("acml_vol"))
                .build();
    }

    private static Stock52weekData getStock52weekData(String stockCode, JSONObject output) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        return Stock52weekData.builder()
                .stockCode(stockCode)
                .date(TODEY)
                .high52Week(output.getLong("w52_hgpr"))
                .high52WeekDate(LocalDate.parse(output.getString("w52_hgpr_date"),formatter))
                .low52Week(output.getLong("w52_lwpr"))
                .low52WeekDate(LocalDate.parse(output.getString("w52_lwpr_date"), formatter))
                .build();
    }

    private static DailyStockData getDailyStockData(String stockCode, JSONObject output) {
        String priceChangeSign = output.has("prdy_vrss_sign") ? output.getString("prdy_vrss_sign") : "0";
        return DailyStockData.builder()
                .stockCode(stockCode)
                .date(TODEY)
                .marketCapitalization(output.getBigInteger("hts_avls"))
                .priceChangeSign(priceChangeSign)
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
