package com.beautifulyomin.mmmm.domain.elasticsearch.repository;

import com.beautifulyomin.mmmm.domain.elasticsearch.document.StocksDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StocksRepositoryByEl extends ElasticsearchRepository<StocksDocument, String> {
}
