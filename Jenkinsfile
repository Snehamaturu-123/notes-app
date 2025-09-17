pipeline {
    agent any

    environment {
        DOCKER_NETWORK = 'notes-net'
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

        stage('Cleanup Old Containers') {
            steps {
                // Stop and remove old containers if they exist
                sh '''
                docker rm -f notes-frontend || true
                docker rm -f notes-backend || true
                docker rm -f notes-mongo || true
                '''
            }
        }

        stage('Create Network') {
            steps {
                // Create network if it doesn’t exist
                sh '''
                docker network inspect ${DOCKER_NETWORK} >/dev/null 2>&1 || \
                docker network create ${DOCKER_NETWORK}
                '''
            }
        }

        stage('Run Containers') {
            steps {
                sh '''
                docker run -d --name notes-mongo --network ${DOCKER_NETWORK} -p 27017:27017 mongo:6
                docker run -d --name notes-backend --network ${DOCKER_NETWORK} -p 5000:5000 \
                  -e SPRING_DATA_MONGODB_URI=mongodb://notes-mongo:27017/notesdb notes-backend
                docker run -d --name notes-frontend --network ${DOCKER_NETWORK} -p 8082:80 \
                  -e REACT_APP_API_URL=http://notes-backend:5000 notes-frontend
                '''
            }
        }

        stage('Verify') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished!'
        }
    }
}
