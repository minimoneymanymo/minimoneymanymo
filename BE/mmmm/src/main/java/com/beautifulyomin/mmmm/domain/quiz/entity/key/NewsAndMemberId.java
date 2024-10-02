package com.beautifulyomin.mmmm.domain.quiz.entity.key;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Data
@Embeddable
public class NewsAndMemberId implements Serializable {
    private Integer childrenId;
    private Long newsQuizId;

    public NewsAndMemberId() {}

    public NewsAndMemberId(Integer childrenId, Long newsQuizId) {
        this.childrenId = childrenId;
        this.newsQuizId = newsQuizId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof NewsAndMemberId)) return false;
        NewsAndMemberId that = (NewsAndMemberId) o;
        return childrenId.equals(that.childrenId) && newsQuizId.equals(that.newsQuizId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(childrenId, newsQuizId);
    }

}
