package com.beautifulyomin.mmmmbatch.batch.quiz.step;

import com.beautifulyomin.mmmmbatch.batch.quiz.entity.NewsQuiz;
import com.beautifulyomin.mmmmbatch.batch.quiz.service.OpenAiService;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CreateQuizTasklet implements Tasklet {

    private static final String NEWS_QUIZ_LIST_KEY = "newsQuizList";
    private final OpenAiService openAiService;

    public CreateQuizTasklet(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        System.out.println("In CreateQuizTasklet");
        List<NewsQuiz> newsQuizList = (List<NewsQuiz>) chunkContext.getStepContext()
                .getStepExecution()
                .getJobExecution()
                .getExecutionContext()
                .get(NEWS_QUIZ_LIST_KEY);
        System.out.println(newsQuizList.size());

        for (NewsQuiz newsQuiz : newsQuizList) {
            String userPrompt = "기사 제목 : " + newsQuiz.getTitle()+
                    "기사 내용 : " + newsQuiz.getContent();
            System.out.println("Open AI 응답 : ");
            System.out.println(openAiService.generateQuiz(userPrompt));

        }



        return RepeatStatus.FINISHED; // 상태를 적절히 반환
    }
}
