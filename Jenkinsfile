pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials_thispear'

    }

    stages {

        stage('Build Docker Image') {
            steps {
                script {
                    dir('FE/minimoneymanymo') {
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

    }
}
