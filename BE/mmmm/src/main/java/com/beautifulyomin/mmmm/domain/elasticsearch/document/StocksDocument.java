package com.beautifulyomin.mmmm.domain.elasticsearch.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

@Data
@Document(indexName = "stocks", createIndex = false)
@Setting(replicas = 1)
public class StocksDocument {
    @Id
    private String id;

    @Field(type = FieldType.Text, analyzer = "ngram_analyzer")  // 인덱스 설정에 맞추어 변경
    private String stock_code;  // Elasticsearch 매핑에 맞게 이름 변경

    @Field(type = FieldType.Text, analyzer = "ngram_analyzer")
    private String company_name;

    @Field(type = FieldType.Text)
    private String industry;

    @Field(type = FieldType.Text)
    private String main_products;

    @Field(type = FieldType.Date)  // Elasticsearch 매핑에 맞추어 변경
    private String listing_date;  // Date 형식으로 변경

    @Field(type = FieldType.Integer)  // Elasticsearch 매핑에 맞추어 변경
    private Integer settlement_month;

    @Field(type = FieldType.Text)
    private String ceo_name;

    @Field(type = FieldType.Text)
    private String website;

    @Field(type = FieldType.Text)
    private String region;

    @Field(type = FieldType.Text)
    private String market_name;

    @Field(type = FieldType.Text)
    private String face_value;

    @Field(type = FieldType.Text)
    private String currency_name;
}
