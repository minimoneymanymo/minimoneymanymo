package com.beautifulyomin.mmmmbatch.batch.quiz.step;

import com.beautifulyomin.mmmmbatch.batch.quiz.entity.NewsQuiz;
import com.beautifulyomin.mmmmbatch.batch.quiz.service.OpenAiService;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.List;
import java.util.Optional;

@Component
public class CreateQuizTasklet implements Tasklet {

    private static final String NEWS_QUIZ_LIST_KEY = "newsQuizList";
    private final OpenAiService openAiService;

    public CreateQuizTasklet(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        List<NewsQuiz> newsQuizList = (List<NewsQuiz>) chunkContext.getStepContext()
                .getStepExecution()
                .getJobExecution()
                .getExecutionContext()
                .get(NEWS_QUIZ_LIST_KEY);

        for (NewsQuiz newsQuiz : newsQuizList) {
            String userPrompt = "기사 제목 : " + newsQuiz.getTitle() + " 기사 내용 : " + newsQuiz.getContent();
            System.out.println("Open AI 응답 : ");
            String aiResponse = openAiService.generateQuiz(userPrompt);
            System.out.println(aiResponse);
            Optional<JSONObject> validatedResponse = validateQuizResponse(aiResponse);


            validatedResponse.ifPresent(response -> {
                newsQuiz.setQuestion(response.getString("question"));
                // JSON 옵션 배열을 문자열로 가져오기
                String optionsString = response.getJSONArray("options").toString();
                newsQuiz.setOptions(optionsString); // JSON 배열을 문자열로 설정

                newsQuiz.setAnswer(response.getInt("correctAnswerId"));
            });

        }

        chunkContext.getStepContext()
                .getStepExecution()
                .getJobExecution()
                .getExecutionContext()
                .put(NEWS_QUIZ_LIST_KEY, newsQuizList);

        return RepeatStatus.FINISHED; // 상태를 적절히 반환
    }

    public Optional<JSONObject> validateQuizResponse(String jsonResponse) {
        try {
            JSONObject jsonObject = new JSONObject(jsonResponse);

            // 질문 형식 확인
            if (!jsonObject.has("question") || jsonObject.getString("question").isEmpty()) {
                return Optional.empty();
            }

            // 옵션 배열 형식 확인
            if (!jsonObject.has("options")) {
                return Optional.empty();
            }

            JSONArray options = jsonObject.getJSONArray("options");
            for (int i = 0; i < options.length(); i++) {
                JSONObject option = options.getJSONObject(i);
                if (!option.has("id") || !option.has("text")) {
                    return Optional.empty();
                }
            }

            // 정답 ID 확인
            if (!jsonObject.has("correctAnswerId")) {
                return Optional.empty();
            }

            return Optional.of(jsonObject);
        } catch (JSONException e) {
            return Optional.empty();
        }
    }

}
