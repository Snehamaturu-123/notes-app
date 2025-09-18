pipeline {
    agent any

    environment {
        DOCKER_NETWORK = 'notes-net'
        DOCKERHUB_USER = 'snehamaturu'
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

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                                                 usernameVariable: 'DOCKER_USER',
                                                 passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker tag notes-frontend:latest ${DOCKERHUB_USER}/notes-frontend:latest
                    docker tag notes-backend:latest ${DOCKERHUB_USER}/notes-backend:latest
                    docker push ${DOCKERHUB_USER}/notes-frontend:latest
                    docker push ${DOCKERHUB_USER}/notes-backend:latest
                    '''
                }
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                sh '''
                docker rm -f notes-frontend || true
                docker rm -f notes-backend || true
                docker rm -f notes-mongo || true
                '''
            }
        }

        stage('Create Network') {
            steps {
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
