pipeline {
    agent any

    environment {
        IMAGE_NAME = 'my-next-app'
        DOCKER_REGISTRY = ''  // Add your Docker registry URL here if pushing
        DOCKER_CREDENTIALS_ID = ''  // Add Jenkins credentials ID for Docker login if needed
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Bchayma/my-jenkins-project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image from frontend folder where Dockerfile is
                    docker.build("${IMAGE_NAME}", './smart_campus/smart-campus/frontend')
                }
            }
        }

        stage('Run Tests / Build') {
            steps {
                script {
                    docker.image("${IMAGE_NAME}").inside {
                        sh 'npm run build'  // Or your test command if you have tests
                    }
                }
            }
        }

        // Optional stage if you want to push to Docker Hub or other registry
        /*
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry("${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS_ID}") {
                        docker.image("${IMAGE_NAME}").push('latest')
                    }
                }
            }
        }
        */

        stage('Deploy') {
            steps {
                echo 'Deploy your app here or notify success'
            }
        }
    }
}
