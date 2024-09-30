# JDK 17
FROM openjdk:17-jdk

# 타임존 설정
RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*  # 불필요한 캐시 제거

# 크롬과 크롬 드라이버 설치
# 크롬 브라우저와 드라이버 버전
ENV CHROME_VERSION=129.0.6668.70
ENV CHROMEDRIVER_VERSION=129.0.6668.70

# 필수 패키지 설치
RUN apt-get install -y \
    wget \
    unzip \
    libxi6 \
    libgconf-2-4 \
    && apt-get clean

# 크롬 설치
RUN wget https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chrome-linux64.zip && \
    unzip chrome-linux64.zip && \
    mv chrome /usr/bin/google-chrome && \
    rm chrome-linux64.zip

# 크롬 드라이버 설치
RUN wget https://storage.googleapis.com/chrome-for-testing-public/${CHROMEDRIVER_VERSION}/linux64/chromedriver-linux64.zip && \
    unzip chromedriver-linux64.zip && \
    mv chromedriver /usr/local/bin/ && \
    chmod +x /usr/local/bin/chromedriver && \
    rm chromedriver-linux64.zip

# JAR 파일을 /app 디렉터리에 복사
COPY build/libs/mmmmBatch-0.0.1-SNAPSHOT.jar /app/mmmm.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app/mmmm.jar", "prod"]
