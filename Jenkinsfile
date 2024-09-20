pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials_thispear'
        TEST_DB_URL= 'jdbc:postgresql://mmmm-testgres-1:5432/test?currentSchema=public'
        TEST_DB_USERNAME = 'postgres'
        TEST_DB_PASSWORD = '1234'

    }

    stages {
        stage('Start PostgreSQL Container') {
            steps {
                
                script {

                    dir('BE/mmmm') {

                        sh '''
                        docker-compose -f testdb-compose.yml up -d
                        '''
                    }

                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dir('BE/mmmm') {
                        sh 'chmod +x gradlew'
                        sh './gradlew clean'
                        sh './gradlew build --info --refresh-dependencies'

                        // JAR 파일 확인
                        sh 'ls -l build/libs/'

                        // Docker 이미지 빌드
                        docker.build('mmmm-api-image', '-f Dockerfile .')
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        sh 'docker tag mmmm-api-image thispear/mmmm:latest'
                        sh 'docker push thispear/mmmm:latest'
                    }
                }
            }
        }
    }


}
