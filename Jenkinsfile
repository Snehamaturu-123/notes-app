pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Snehamaturu-123/notes-app'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Start Containers') {
            steps {
                // Start containers in detached mode
                sh 'docker-compose up -d'

                // Wait for MongoDB to be ready
                sh '''
                echo "Waiting for MongoDB..."
                until docker exec notes-mongo mongo --eval "db.adminCommand('ping')" &>/dev/null; do
                    sleep 2
                done
                echo "MongoDB is ready!"
                '''

                // Optionally wait for backend to be ready
                sh '''
                echo "Waiting for backend..."
                until curl -s http://localhost:5000/health &>/dev/null; do
                    sleep 2
                done
                echo "Backend is ready!"
                '''
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps'
                sh 'docker-compose logs --tail=20'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished!'
        }
    }
}
