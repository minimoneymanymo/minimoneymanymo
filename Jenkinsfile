pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials_thispear'

        VITE_SSAFY_API_URL = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/"
        VITE_API_ENDPOINT = "http://localhost:8080"
        VITE_API_CONTEXT_PATH = "mmmm"
        VITE_API_VERSION = "v1"
    }


    

    stages {

        stage('Build Docker Image') {
            steps {
                script {
                    dir('FE/minimoneymanymo') {
                         sh 'rm -rf node_modules'
                        docker.build('mmmm-react-image', '-f Dockerfile .')
                    }
                }
            }
        }

        stage('Remove Old Docker Images') {
            steps {
                script {
                    // 오래된 이미지를 삭제합니다.
                    sh 'docker image prune -f'
                }
            }
        }

        
        stage('Up Docker Compose') {
            steps {
                script {
                    // /var/jenkins_home/compose로 이동하여 Docker Compose 실행
                    sh 'cd /var/jenkins_home/compose && docker-compose -f docker-compose.mmmm-react-blue.yml up -d'
                }
            }
        }

    }
}

