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
                        withCredentials([file(credentialsId: 'ENV', variable: 'env_file')]) {
                                            sh 'echo $env_file'
                                            sh 'cp $env_file ./.env'
                                        }

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

