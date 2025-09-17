pipeline {
    agent any

    environment {
        DOCKER_NETWORK = 'notes-net'
        DOCKERHUB_CREDENTIALS = 'dockerhub-cred' // Add your Jenkins DockerHub credentials ID here
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Snehamaturu-123/notes-app'
            }
        }

        stage('Cleanup Old Containers & Images') {
            steps {
                sh '''
                docker rm -f notes-backend || true
                docker rm -f notes-frontend || true
                docker rm -f notes-mongo || true 
                docker rmi -f notes-backend || true
                docker rmi -f notes-frontend || true
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build backend frontend'
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
          -e SPRING_DATA_MONGODB_URI=mongodb://notes-mongo:27017/notesdb notes2-backend
        docker run -d --name notes-frontend --network ${DOCKER_NETWORK} -p 8082:80 \
          -e REACT_APP_API_URL=http://notes-backend:5000 notes2-frontend
        '''
    }
}


        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    docker tag notes-backend $DOCKER_USER/notes-backend:latest
                    docker tag notes-frontend $DOCKER_USER/notes-frontend:latest
                    docker push $DOCKER_USER/notes-backend:latest
                    docker push $DOCKER_USER/notes-frontend:latest
                    '''
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
