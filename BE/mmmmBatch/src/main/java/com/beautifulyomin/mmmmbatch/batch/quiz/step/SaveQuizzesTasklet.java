package com.beautifulyomin.mmmmbatch.batch.quiz.step;

import com.beautifulyomin.mmmmbatch.batch.quiz.entity.NewsQuiz;
import com.beautifulyomin.mmmmbatch.batch.quiz.repository.NewsQuizRepository;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SaveQuizzesTasklet implements Tasklet {
    private static final String NEWS_QUIZ_LIST_KEY = "newsQuizList";
    private final NewsQuizRepository newsQuizRepository;
    public SaveQuizzesTasklet(NewsQuizRepository newsQuizRepository) {
        this.newsQuizRepository = newsQuizRepository;
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        List<NewsQuiz> newsQuizList = (List<NewsQuiz>) chunkContext.getStepContext()
                .getStepExecution()
                .getJobExecution()
                .getExecutionContext()
                .get(NEWS_QUIZ_LIST_KEY);

        for (NewsQuiz newsQuiz : newsQuizList) {
            System.out.println(newsQuiz.getTitle());
            if(newsQuiz.getAnswer() == null)continue;
            newsQuizRepository.save(newsQuiz);

        }

        return RepeatStatus.FINISHED;

    }
}
