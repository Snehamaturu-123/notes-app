pipeline {
    agent any

    environment {
        DOCKER_NETWORK = "notes-net"
        BACKEND_IMAGE = "notes-backend"
        FRONTEND_IMAGE = "notes-frontend"
        MONGO_IMAGE = "mongo:6"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Snehamaturu-123/notes-app.git'
            }
        }

        stage('Build Backend') {
            steps {
                sh 'cd backend && ./mvnw clean package -DskipTests'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                docker build -t $BACKEND_IMAGE ./backend
                docker build -t $FRONTEND_IMAGE ./frontend
                """
            }
        }

        stage('Create Network') {
            steps {
                sh "docker network inspect $DOCKER_NETWORK || docker network create $DOCKER_NETWORK"
            }
        }

        stage('Run Containers') {
            steps {
                sh """
                docker rm -f notes-backend || true
                docker rm -f notes-frontend || true
                docker rm -f notes-mongo || true

                docker run -d --name notes-mongo --network $DOCKER_NETWORK -p 27017:27017 $MONGO_IMAGE
                docker run -d --name notes-backend --network $DOCKER_NETWORK -p 5000:5000 -e SPRING_DATA_MONGODB_URI=mongodb://notes-mongo:27017/notesdb $BACKEND_IMAGE
                docker run -d --name notes-frontend --network $DOCKER_NETWORK -p 8082:80 $FRONTEND_IMAGE
                """
            }
        }
    }

    post {
        success {
            echo "Notes app deployed successfully! Frontend: http://localhost:8082, Backend: http://localhost:5000"
        }
        failure {
            echo "Deployment failed. Check logs."
        }
    }
}
