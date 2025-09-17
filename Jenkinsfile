pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Snehamaturu-123/notes-app.git'
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Backend') {
                    steps {
                        sh 'docker build -t notes-backend ./backend'
                    }
                }
                stage('Build Frontend') {
                    steps {
                        sh 'docker build -t notes-frontend ./frontend'
                    }
                }
            }
        }

        stage('Create Network') {
            steps {
                sh 'docker network create notes-net || true'
            }
        }

        stage('Run Containers') {
            steps {
                sh '''
                docker run -d --name notes-mongo --network notes-net -p 27017:27017 mongo:6
                docker run -d --name notes-backend --network notes-net -p 5000:5000 notes-backend
                docker run -d --name notes-frontend --network notes-net -p 8082:80 notes-frontend
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Deployment failed. Check logs.'
        }
    }
}
