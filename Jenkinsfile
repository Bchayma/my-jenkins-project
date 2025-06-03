pipeline {
    agent any

    stages {
        stage('Create Folder') {
            steps {
                sh 'mkdir -p demo_folder'
            }
        }
        stage('Create File') {
            steps {
                sh 'echo "Hello from Jenkins!" > demo_folder/message.txt'
            }
        }
        stage('Read File') {
            steps {
                sh 'cat demo_folder/message.txt'
            }
        }
    }
}
