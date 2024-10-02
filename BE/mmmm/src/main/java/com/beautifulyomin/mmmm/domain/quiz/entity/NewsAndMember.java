package com.beautifulyomin.mmmm.domain.quiz.entity;

import com.beautifulyomin.mmmm.domain.member.entity.Children;
import com.beautifulyomin.mmmm.domain.quiz.entity.key.NewsAndMemberId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.beautifulyomin.mmmmbatch.batch.quiz.entity.NewsQuiz;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "news_and_members")
public class NewsAndMember {
    @EmbeddedId
    private NewsAndMemberId id; // 복합 키

    @ManyToOne
    @MapsId("childrenId")
    @JoinColumn(name = "children_id", nullable = false)
    private Children children;

    @ManyToOne
    @MapsId("newsQuizId")
    @JoinColumn(name = "news_quiz_id", nullable = false)
    private NewsQuiz newsQuiz;

    //자기가 몇번을 체크해서 틀렸는지 확인도 가능하면 좋을듯해서
    //0이면 맞춘거 그외는 틀렸고 어떤답을 체크했는지로 보이라고 int로 했어요
    //enum으로 빼려하다가 openAi가 일단 5지선다 이내로 주긴하는데 혹시멀라서....
    @Column(nullable = false)
    private Integer isQuizAnswered = -1;


}
