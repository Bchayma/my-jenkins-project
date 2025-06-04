// pipeline {
//     agent any

//     environment {
//         IMAGE_NAME = 'my-next-app'
//         DOCKER_REGISTRY = ''  // Add your Docker registry URL here if pushing
//         DOCKER_CREDENTIALS_ID = ''  // Add Jenkins credentials ID for Docker login if needed
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 // git 'https://github.com/Bchayma/my-jenkins-project.git'
//                 git branch: 'main', url: 'https://github.com/Bchayma/my-jenkins-project.git'

//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 script {
//                     // Build Docker image from frontend folder where Dockerfile is
//                     docker.build("${IMAGE_NAME}", './smart_campus/smart-campus/frontend')
//                 }
//             }
//         }

//         stage('Run Tests / Build') {
//             steps {
//                 script {
//                     docker.image("${IMAGE_NAME}").inside {
//                         sh 'npm run build'  // Or your test command if you have tests
//                     }
//                 }
//             }
//         }

//         // Optional stage if you want to push to Docker Hub or other registry
//         /*
//         stage('Push Docker Image') {
//             steps {
//                 script {
//                     docker.withRegistry("${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS_ID}") {
//                         docker.image("${IMAGE_NAME}").push('latest')
//                     }
//                 }
//             }
//         }
//         */

//         stage('Deploy') {
//             steps {
//                 echo 'Deploy your app here or notify success'
//             }
//         }
//     }
// }

pipeline {
    agent any

    environment {
        IMAGE_NAME = 'my-next-app'
        DOCKER_REGISTRY = ''  // Add your Docker registry URL here if pushing
        DOCKER_CREDENTIALS_ID = ''  // Add Jenkins credentials ID for Docker login if needed
    }

    stages {
        stage('Prepare Workspace') {
            steps {
                /* More thorough workspace cleanup */
                deleteDir()
                
                /* Verify clean state */
                sh 'pwd && ls -la'
            }
        }

        // stage('Checkout Code') {
        //     steps {
        //         retry(3) {  // Adds retry for flaky connections
        //             checkout([
        //                 $class: 'GitSCM',
        //                 branches: [[name: '*/main']],
        //                 extensions: [
        //                     [$class: 'CleanBeforeCheckout'],
        //                     [$class: 'CloneOption', 
        //                      depth: 1,  // Shallow clone for speed
        //                      noTags: true]
        //                 ],
        //                 userRemoteConfigs: [[
        //                     url: 'https://github.com/Bchayma/my-jenkins-project.git',
        //                     credentialsId: '' // Add credentials if private
        //                 ]]
        //             ])
        //         }
                
        //         /* Post-checkout verification */
        //         sh 'git status && git remote -v'
        //     }
        // }
        stage('Checkout') {
    steps {
        checkout([
            $class: 'GitSCM',
            branches: [[name: '*/main']],
            extensions: [[$class: 'CleanBeforeCheckout']], // pour nettoyer avant checkout
            userRemoteConfigs: [[
                url: 'https://github.com/Bchayma/my-jenkins-project.git'
                // credentialsId: '' // si nécessaire
            ]]
        ])
    }
}


        stage('Verify Structure') {
            steps {
                sh '''
                    echo "Workspace contents:"
                    ls -la
                    echo "\nDockerfile path contents:"
                    ls -la smart_campus/smart-campus/frontend
                    [ -f smart_campus/smart-campus/frontend/Dockerfile ] || exit 1
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Added timeouts and explicit path verification
                    timeout(time: 15, unit: 'MINUTES') {
                        docker.build("${IMAGE_NAME}", './smart_campus/smart-campus/frontend')
                    }
                }
            }
        }

        stage('Run Tests / Build') {
            steps {
                script {
                    docker.image("${IMAGE_NAME}").inside('-u root') {  // Explicit user
                        // sh 'npm ci --no-audit'  // More reliable than npm install
                        sh 'npm install --no-audit'

                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment would happen here'
                // Consider adding actual deployment steps
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed - cleaning up'
            // archiveArtifacts artifacts: '**/build/**/*'  // Uncomment to save build outputs
        }
        failure {
            echo 'Pipeline failed - sending notification'
            // mail to: 'team@example.com', subject: 'Pipeline Failed'
        }
    }
}