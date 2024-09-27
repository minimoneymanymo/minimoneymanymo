package com.beautifulyomin.mmmmbatch.batch.quiz.step;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Component
public class WebCrawlingTasklet implements Tasklet {

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        // ChromeDriver 경로 설정
        System.setProperty("webdriver.chrome.driver", "C:\\\\Users\\\\SSAFY\\\\Driver\\\\chromedriver-win64\\\\chromedriver.exe"); // chromedriver의 경로로 수정

        WebDriver driver = new ChromeDriver();
        WebDriverWait wait = new WebDriverWait(driver,  Duration.ofSeconds(10)); // 10초 대기


        try {
            // 크롤링할 웹페이지 열기
            driver.get("https://news.naver.com/breakingnews/section/101/262");

            // 원하는 div 요소 찾기
            WebElement articleDiv = driver.findElement(By.cssSelector("div.section_article._TEMPLATE"));

            // sa_thumb_link _NLOG_IMPRESSION 클래스의 a 태그 모두 찾기
            List<WebElement> linkElements = articleDiv.findElements(By.cssSelector("a.sa_thumb_link._NLOG_IMPRESSION"));

            // 링크의 href 속성 값을 저장할 리스트 생성
            List<String> hrefList = new ArrayList<>();

            // 각 a 태그의 href 속성 값 미리 추출
            for (WebElement link : linkElements) {
                String hrefValue = link.getAttribute("href");
                hrefList.add(hrefValue); // href 값을 리스트에 추가
            }
            // 각 a 태그의 href 속성 값 출력 및 접속
            for (String link : hrefList) {

                System.out.println("링크 href: " + link);

                // 링크에 접속
                driver.get(link);

                // id가 title_area인 h2 태그 안의 span 요소 찾기
                WebElement titleElement = driver.findElement(By.cssSelector("#title_area"));
                String titleValue = titleElement.getAttribute("outerHTML");

                // id가 dic_area인 요소 찾기
                WebElement dicElement = driver.findElement(By.id("dic_area"));
                String dicValue = dicElement.getAttribute("outerHTML");

                // 추출한 데이터 출력
                System.out.println("제목: " + titleValue);
                System.out.println("내용: " + dicValue);


            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 브라우저 종료
            driver.quit();
        }

        return RepeatStatus.FINISHED; // 작업 완료
    }
}
