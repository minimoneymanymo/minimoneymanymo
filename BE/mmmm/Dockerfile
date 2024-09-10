# 빌드 단계
FROM gradle:8.8-jdk17 AS build

# 작업 디렉토리 설정
WORKDIR /app

# Gradle 빌드 파일과 소스 파일을 복사
COPY build.gradle settings.gradle ./
COPY src ./src

# 종속성을 다운로드하고 빌드를 실행
RUN gradle clean build --no-daemon

# 배포 단계
FROM openjdk:17

# 타임존 설정
RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && echo Asia/Seoul > /etc/timezone

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 JAR 파일을 복사
COPY --from=build /app/build/libs/mmmm-0.0.1-SNAPSHOT.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=dev", "-Duser.timezone=Asia/Seoul", "app.jar"]