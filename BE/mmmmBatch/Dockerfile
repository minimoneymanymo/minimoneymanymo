# JDK 17 기반 이미지 사용
FROM openjdk:17-jdk

# 타임존 설정 (옵션)
RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && echo Asia/Seoul > /etc/timezone

# JAR 파일을 /app 디렉터리에 복사
COPY build/libs/mmmm-0.0.1-SNAPSHOT.jar /app/mmmm.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app/mmmm.jar", "prod"]