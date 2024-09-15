pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials_thispear'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    // Dockerfile이 존재하는 디렉토리
                    dir('BE/mmmm') {
                        // Ensure the Gradle build creates the JAR file
                        sh './gradlew clean'
                        sh 'chmod +x gradlew'
                        sh './gradlew build'
                        
                        // Verify if the JAR file exists
                        sh 'ls -l build/libs/'

                        // Build Docker image
                        apiImage = docker.build('mmmm-api-image')
                    }
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    // Docker Commons 플러그인을 사용해 Docker Hub 레지스트리에 푸시
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        // build 단계에서 반환된 customImage를 사용하여 푸시합니다.
                        apiImage.push('latest')
                    }
                }
            }
        }
    }
}
