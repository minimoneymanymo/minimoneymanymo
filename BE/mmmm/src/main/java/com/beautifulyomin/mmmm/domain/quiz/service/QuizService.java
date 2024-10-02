package com.beautifulyomin.mmmm.domain.quiz.service;

import com.beautifulyomin.mmmm.domain.member.repository.ChildrenRepository;
import com.beautifulyomin.mmmm.domain.quiz.dto.NewsQuizResponseDTO;
import com.beautifulyomin.mmmm.domain.quiz.entity.NewsAndMember;
import com.beautifulyomin.mmmm.domain.quiz.entity.key.NewsAndMemberId;
import com.beautifulyomin.mmmm.domain.quiz.repository.NewsAndMembersRepository;
import com.beautifulyomin.mmmm.domain.quiz.repository.NewsQuizRepository;
import org.springframework.stereotype.Service;
import com.beautifulyomin.mmmmbatch.batch.quiz.entity.NewsQuiz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {
    private final NewsAndMembersRepository newsAndMembersRepository;
    private final NewsQuizRepository newsQuizRepository;
    private final ChildrenRepository childrenRepository;


    public QuizService(NewsAndMembersRepository newsAndMembersRepository, NewsQuizRepository newsQuizRepository, ChildrenRepository childrenRepository) {
        this.newsAndMembersRepository = newsAndMembersRepository;
        this.newsQuizRepository = newsQuizRepository;
        this.childrenRepository = childrenRepository;
    }
    //오늘날짜 기사 불러오기
    public List<NewsQuiz> findAllByPublishedDateTodayNewsQuizzes(){
        return newsQuizRepository.findAllByPublishedDateToday(LocalDate.now());
    }

    //전체퀴즈 페이지네이션
    public Page<NewsQuiz> getPaginatedNewsQuizzes(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return newsQuizRepository.findAll(pageable);
    }

    //문제별 정답여부(오늘날짜 문제의 경우 사용)
    public int getIsQuizAnswered(int childrenId, Long quizId){
        Optional<NewsAndMember> newsAndMember = newsAndMembersRepository.findById(
                new NewsAndMemberId(childrenId, (long) quizId));
        return newsAndMember.map(NewsAndMember::getIsQuizAnswered).orElse(-1);
    }

    //자신의 모든 풀이여부(전체 문제의 경우 사용)
    public List<NewsAndMember> getNewsAndMembers(int childrenId){
        return newsAndMembersRepository.findAllByIdChildrenId(childrenId);
    }

    //response타입으로 변환
    public List<NewsQuizResponseDTO> changeNewsQuizToResponseDTO(int childrenId, List<NewsQuiz> quizList) {
        List<NewsQuizResponseDTO> responseDTOList = new ArrayList<>();

        for (NewsQuiz quiz : quizList) {
            int isQuizAnswered = (childrenId == -1) ? -1 : getIsQuizAnswered(childrenId, quiz.getId());
            NewsQuizResponseDTO responseDTO = buildNewsQuizResponseDTO(quiz, isQuizAnswered);
            responseDTOList.add(responseDTO);
        }
        return responseDTOList;
    }
    public NewsQuizResponseDTO buildNewsQuizResponseDTO(NewsQuiz quiz, int isQuizAnswered) {
        return NewsQuizResponseDTO.builder()
                .newsQuiz(quiz)
                .isQuizAnswered(isQuizAnswered)
                .build();
    }


}
