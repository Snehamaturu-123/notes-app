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
                script {
                    try {
                        sh 'docker-compose build'
                    } catch (err) {
                        echo "Error building Docker images"
                        sh 'docker-compose logs --tail=50'
                        error "Build failed"
                    }
                }
            }
        }

        stage('Create Network') {
            steps {
                script {
                    try {
                        sh 'docker network create notes-net || true'
                    } catch (err) {
                        echo "Error creating Docker network"
                        error "Network creation failed"
                    }
                }
            }
        }

        stage('Clean Existing Containers') {
            steps {
                script {
                    echo "Stopping and removing existing containers if any..."
                    sh '''
                    docker rm -f notes-mongo || true
                    docker rm -f notes-backend || true
                    docker rm -f notes-frontend || true
                    '''
                }
            }
        }

        stage('Run Containers') {
            steps {
                script {
                    try {
                        sh '''
                        docker run -d --name notes-mongo --network notes-net -p 27017:27017 mongo:6
                        docker run -d --name notes-backend --network notes-net -p 5000:5000 notes-backend
                        docker run -d --name notes-frontend --network notes-net -p 8082:80 notes-frontend
                        '''
                    } catch (err) {
                        echo "Error starting containers, showing logs..."
                        sh 'docker logs notes-mongo || true'
                        sh 'docker logs notes-backend || true'
                        sh 'docker logs notes-frontend || true'
                        error "Container startup failed"
                    }
                }
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
