package com.beautifulyomin.mmmm.controller;

import com.beautifulyomin.mmmm.common.JsonRequestUtil;
import com.beautifulyomin.mmmm.domain.fund.dto.UserKeyDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/fin")
@RequiredArgsConstructor
public class FinController {

    @Value("${api.ssafy.apikey}")
    private String apiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final JsonRequestUtil jsonRequestUtil;

    // 은행 리스트 조회
    @PostMapping("/inquireBankCodes")
    public Mono<String> inquireBankCodes() {
        // JSON 객체 생성
        ObjectNode jsonObject = jsonRequestUtil.createRequestBody("inquireBankCodes", "");
        return webClient.post()
                .uri("/edu/bank/inquireBankCodes") // URI에서 기본 URL 제외
                .bodyValue(jsonObject)
                .retrieve()
                .bodyToMono(String.class);
    }
    
    //사용자 정보 등록
    @PostMapping("/member")
    public Mono<String> registerMember(@RequestParam("userId") String userId) {
        ObjectNode jsonObject = objectMapper.createObjectNode();
        jsonObject.put("apiKey", apiKey);
        jsonObject.put("userId", userId);

        return webClient.post()
                .uri("/member")
                .bodyValue(jsonObject)
                .retrieve()
                .bodyToMono(String.class);
    }

    //사용자 계정조회
    @PostMapping("/member/search")
    public Mono<String> searchMember(@RequestParam("userId") String userId) {
        ObjectNode jsonObject = objectMapper.createObjectNode();
        System.out.println("UUUUUUUUUU"+userId);
        jsonObject.put("apiKey", apiKey);
        jsonObject.put("userId", userId);

        return webClient.post()
                .uri("/member/search")
                .bodyValue(jsonObject)
                .retrieve()
                .bodyToMono(String.class);
    }

    //계좌 조회
    @PostMapping("/inquireDemandDepositAccount")
    public Mono<String> inquireDemandDepositAccount(
            @RequestBody UserKeyDto userKeyDto,
            @RequestParam("accountNo") String accountNo
    ) {
        ObjectNode jsonObject = jsonRequestUtil.createRequestBody("inquireDemandDepositAccount", userKeyDto.getUserKey());
        jsonObject.put("accountNo", accountNo);

        return webClient.post()
                .uri("/edu/demandDeposit/inquireDemandDepositAccount") // URI에서 기본 URL 제외
                .bodyValue(jsonObject)
                .retrieve()
                .bodyToMono(String.class);
    }

    //1원 인증
    @PostMapping("/openAccountAuth")
    public Mono<String> openAccountAuth(
            @RequestBody UserKeyDto userKeyDto,
            @RequestParam("accountNo") String accountNo,
            @RequestParam("authText") String authText
    ) {
        ObjectNode jsonObject = jsonRequestUtil.createRequestBody("openAccountAuth", userKeyDto.getUserKey());
        jsonObject.put("accountNo", accountNo);
        jsonObject.put("authText", authText);
        return webClient.post()
                .uri("/edu/accountAuth/openAccountAuth")
                .bodyValue(jsonObject)
                .retrieve()
                .bodyToMono(String.class);
    }

    //1원 인증 검증
    @PostMapping("/checkAuthCode")
    public Mono<String> checkAuthCode(
            @RequestBody UserKeyDto userKeyDto,
            @RequestParam("accountNo") String accountNo,
            @RequestParam("authText") String authText,
            @RequestParam("authCode") String authCode
    ) {
        ObjectNode jsonObject = jsonRequestUtil.createRequestBody("checkAuthCode", userKeyDto.getUserKey());
        jsonObject.put("accountNo", accountNo);
        jsonObject.put("authText", authText);
        jsonObject.put("authCode", authCode);

        return webClient.post()
                .uri("/edu/accountAuth/checkAuthCode")
                .bodyValue(jsonObject)
                .retrieve()
                .bodyToMono(String.class);
    }

    // 계좌 입금
    @PostMapping("/updateDemandDepositAccountDeposit")
    public Mono<String> updateDemandDepositAccountDeposit(
            @RequestBody UserKeyDto userKeyDto,
            @RequestParam("accountNo") String accountNo,
            @RequestParam("transactionBalance") String transactionBalance
    ) {
        // JSON 객체 생성
        ObjectNode jsonObject = jsonRequestUtil.createRequestBody("updateDemandDepositAccountDeposit", userKeyDto.getUserKey());
        jsonObject.put("accountNo", accountNo);
        jsonObject.put("transactionBalance", transactionBalance);
        return webClient.post()
                .uri("/edu/demandDeposit/updateDemandDepositAccountDeposit")
                .bodyValue(jsonObject)
                .retrieve()
                .bodyToMono(String.class);
    }

    // 계좌 출금
    @PostMapping("/updateDemandDepositAccountWithdrawal")
    public Mono<String> updateDemandDepositAccountWithdrawal(
            @RequestBody UserKeyDto userKeyDto,
            @RequestParam("accountNo") String accountNo,
            @RequestParam("transactionBalance") String transactionBalance
    ) {
        ObjectNode jsonObject = jsonRequestUtil.createRequestBody("updateDemandDepositAccountWithdrawal", userKeyDto.getUserKey());
        jsonObject.put("accountNo", accountNo);
        jsonObject.put("transactionBalance", transactionBalance);

        return webClient.post()
                .uri("/edu/demandDeposit/updateDemandDepositAccountWithdrawal")
                .bodyValue(jsonObject)
                .retrieve()
                .bodyToMono(String.class);
    }

    //머니 환불(환불API -> 부모 계좌 입금)
    //머니 충전(충전API -> 부모 계좌 출금)
    //용돈/보상머니/출금요청 (해당 API -> 자식 계좌 입금) => 아직 안함
}
