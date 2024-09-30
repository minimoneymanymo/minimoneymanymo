# JDK 17
FROM openjdk:17-alpine

# 타임존 설정
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

# 크롬과 크롬 드라이버 설치
# 크롬 브라우저와 드라이버 버전
ENV CHROME_VERSION=129.0.6668.70
ENV CHROMEDRIVER_VERSION=129.0.6668.70

# 필수 패키지 설치
RUN apk add --no-cache \
    wget \
    unzip \
    libxi \
    nss \
    freetype \
    alsa-lib

# 크롬 설치
RUN wget https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chrome-linux64.zip && \
    unzip chrome-linux64.zip && \
    mv chrome-linux64/chrome /usr/bin/google-chrome && \
    rm -r chrome-linux64 && \
    rm chrome-linux64.zip

# 크롬 드라이버 설치
RUN wget https://storage.googleapis.com/chrome-for-testing-public/${CHROMEDRIVER_VERSION}/linux64/chromedriver-linux64.zip && \
    unzip chromedriver-linux64.zip && \
    mv chromedriver-linux64/chromedriver /usr/local/bin/chromedriver && \
    chmod +x /usr/local/bin/chromedriver && \
    rm chromedriver-linux64.zip && \
    rm -r chromedriver-linux64

# JAR 파일을 /app 디렉터리에 복사
COPY build/libs/mmmmBatch-0.0.1-SNAPSHOT.jar /app/mmmm.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app/mmmm.jar", "prod"]
