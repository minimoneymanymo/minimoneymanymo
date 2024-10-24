pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials_thispear'
        TEST_DB_URL = 'jdbc:postgresql://postgres:5432/testbases?currentSchema=public'
        TEST_DB_USERNAME = 'test_user'
        TEST_DB_PASSWORD = 'test_pwd'

    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    dir('BE/mmmm') {
                        sh 'chmod +x gradlew'
                        sh './gradlew clean'
                        sh './gradlew build --info --refresh-dependencies -x test'

                        // JAR 파일 확인
                        sh 'ls -l build/libs/'

                        // Docker 이미지 빌드
                        docker.build('mmmm-api-image', '-f Dockerfile .')
                    dir('FE/minimoneymanymo') {
                        sh 'ls -l'
                        sh 'rm -rf node_modules'
                        docker.build('mmmm-react-image', '-f Dockerfile .')

                    }
                }
            }
        }

        stage('Remove Old Docker Images') {
            steps {
                script {
                    sh 'docker image prune -f'
                }
            }
        }


        stage('Up Docker Compose') {
            steps {
                script {
                    // /var/jenkins_home/compose로 이동하여 Docker Compose 실행
                    sh 'cd /var/jenkins_home/compose && docker-compose -f docker-compose.api-blue.yml up -d'
                    sh 'cd /var/jenkins_home/compose && docker-compose -f docker-compose.mmmm-react-blue.yml up -d'
                }
            }
        }
    }
}
