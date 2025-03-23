pipeline {
    agent any 

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning Repository...'
                git branch: 'G7-30-Write-tests-for-treatment-service', url: 'https://github.com/harika-maha/F21AO-Group7.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker Containers...'
                sh 'docker-compose build'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Installing dependencies and running tests...'
                sh '''
                   cd Treatment-service
                   npm install
                   npm test
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker Images...'
                sh 'docker-compose build'
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo 'Pushing Docker Images to DockerHub...'
                withCredentials([string(credentialsId: 'dockerhub-credentials', variable: 'DOCKERHUB_PASSWORD')]) {
                    sh '''
                        docker login -u YOUR_DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD
                        docker-compose push
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying Application...'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up Docker...'
            sh 'docker-compose down'
        }
    }
}