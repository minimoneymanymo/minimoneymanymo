pipeline {
    agent any

    stages {
        stage('Check Jenkinsfile') {
            steps {
                // Jenkinsfile이 읽히고 있는지 확인
                echo "Jenkinsfile is being read successfully!"
            }
        }
        stage('Build') {
            steps {
                // 빌드 과정
                echo "Building the project..."
            }
        }
    }
}