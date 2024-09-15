pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials_thispear'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    // Dockerfile이 존재하는 디렉토리로 이동
                    dir('BE/mmmm') {
                        // Gradle 빌드 수행
                        sh 'chmod +x gradlew'  // gradlew에 실행 권한 부여
                        sh './gradlew clean '  // 기존 빌드 아티팩트 삭제
                        sh './gradlew build --info --no-cache '  // 프로젝트 빌드

                        // 빌드 후 JAR 파일 확인
                        sh 'ls -l build/libs/'

                        // Docker 이미지 빌드
                        docker.build('mmmm-api-image', '-f Dockerfile .')

                        // 선택 사항: Docker 이미지에 특정 태그를 추가할 수 있습니다
                        // apiImage.tag('latest')
                    }
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    // Docker Hub 레지스트리에 Docker 이미지 푸시
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        // 'latest' 태그로 Docker 이미지 푸시
                        docker.image('mmmm-api-image').push('latest')
                    }
                }
            }
        }
    }
}
