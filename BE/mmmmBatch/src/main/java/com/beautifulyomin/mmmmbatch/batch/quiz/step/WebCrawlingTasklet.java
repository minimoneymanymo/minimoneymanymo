package com.beautifulyomin.mmmmbatch.batch.quiz.step;

import com.beautifulyomin.mmmmbatch.batch.quiz.entity.NewsQuiz;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.devtools.v85.domsnapshot.model.StringIndex;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Component
public class WebCrawlingTasklet implements Tasklet {

    private static final String DRIVER_PATH = "C:\\Users\\SSAFY\\Driver\\chromedriver-win64\\chromedriver.exe"; // ChromeDriver 경로
    private static final String URL = "https://news.naver.com/breakingnews/section/101/262"; // 크롤링할 URL
    private static final int TIMEOUT_SECONDS = 3; // 대기 시간
    private static final String NEWS_QUIZ_LIST_KEY = "newsQuizList";  // StepExecutionContext 키

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        System.setProperty("webdriver.chrome.driver", DRIVER_PATH); // 드라이버 경로 설정
        List<NewsQuiz> newsQuizList = new ArrayList<>();

        WebDriver driver = new ChromeDriver(); // WebDriver 객체 생성
        try {
            driver.get(URL);
            newsQuizList = crawlArticles(driver);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            driver.quit(); // WebDriver 종료
        }
        chunkContext.getStepContext().getStepExecution().getJobExecution().getExecutionContext().put(NEWS_QUIZ_LIST_KEY, newsQuizList);

        System.out.println(newsQuizList.size());
        System.out.println(newsQuizList.size());

        return RepeatStatus.FINISHED; // 작업 완료
    }

    private List<NewsQuiz> crawlArticles(WebDriver driver) {

        List<NewsQuiz> newsQuizList = new ArrayList<>();

        // 원하는 div 요소 찾기
        WebElement articleDiv = driver.findElement(By.cssSelector("div.section_article._TEMPLATE"));

        // 링크 및 언론사 찾기
        List<WebElement> linkElements = articleDiv.findElements(By.cssSelector("a.sa_thumb_link._NLOG_IMPRESSION"));
        List<WebElement> publishers = articleDiv.findElements(By.cssSelector("div.sa_text_press"));

        List<String> hrefList = new ArrayList<>();
        List<String> publisherList = new ArrayList<>();

        for (int idx = 0; idx < linkElements.size(); idx++) {
            hrefList.add(linkElements.get(idx).getAttribute("href"));
            publisherList.add(publishers.get(idx).getText());
        }

        // 각 링크에 접속하여 데이터 추출
        for (int idx = 0; idx < hrefList.size(); idx++) {
            String link = hrefList.get(idx);
            System.out.println("링크 href: " + link);

            driver.get(link);
            NewsQuiz newsQuiz = extractArticleData(driver, publisherList.get(idx)); // 빌더 패턴 사용
            newsQuizList.add(newsQuiz);
        }

        return newsQuizList;
    }

    private NewsQuiz extractArticleData(WebDriver driver, String publisher) {
        String titleValue = getElementText(driver, By.cssSelector("#title_area"));
        String dic = getElementText(driver, By.id("dic_area"));
        String dicHtml = getElementOuterHTML(driver, By.id("dic_area"));
        String dateValue = getElementText(driver, By.cssSelector("span.media_end_head_info_datestamp_time._ARTICLE_DATE_TIME"));
        String journalistName = getElementText(driver, By.cssSelector("em.media_end_head_journalist_name"));

        // 추출한 데이터 출력
        System.out.println("제목: " + titleValue);
        System.out.println("언론사: " + publisher);
        System.out.println("날짜 및 시간: " + dateValue);
        System.out.println("기자 이름: " + journalistName);
        System.out.println("내용 HTML: " + dicHtml);

        // 빌더 패턴을 사용하여 NewsQuiz 객체 생성
        return NewsQuiz.builder()
                .title(titleValue)
                .publisher(publisher)
                .publishedDate(parsePublishedDate(dateValue))
                .author(journalistName)
                .contentHtml(dicHtml)
                .content(dic)
                .build();
    }


    //텍스트만 가져오는 함수
    private String getElementText(WebDriver driver, By by) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT_SECONDS));
            WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(by));
            return element.getText(); // 요소의 텍스트 반환
        } catch (TimeoutException | NoSuchElementException e) {
            return ""; // 요소가 없거나 시간이 초과되면 빈 문자열 반환
        }
    }

    //html전부를 가져오는 함수
    private String getElementOuterHTML(WebDriver driver, By by) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT_SECONDS));
            WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(by));
            return element.getAttribute("outerHTML"); // 요소의 HTML 반환
        } catch (TimeoutException | NoSuchElementException e) {
            return ""; // 요소가 없거나 시간이 초과되면 빈 문자열 반환
        }
    }
    //크롤링한 날짜데이터를 timstamp로 변환
    public LocalDateTime parsePublishedDate(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd. a h:mm");
        try {
            return LocalDateTime.parse(dateString, formatter);
        } catch (DateTimeParseException e) {
            // 변환 실패 시 예외 처리 (예: 로그 남기기)
            System.err.println("Invalid date format: " + dateString);
            return null;
        }
    }
}
