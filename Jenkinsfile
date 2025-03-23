pipeline {
    agent any 

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning Repository...'
                withCredentials([string(credentialsId: 'GitHub-Creds-pipeline', variable: 'GITHUB_TOKEN')]) {
                    sh 'git clone https://$GITHUB_TOKEN@github.com/harika-maha/F21AO-Group7.git'
                    sh 'cd F21AO-Group7 && git checkout G7-30-Write-tests-for-treatment-service'
                }
            }
        }

        stage('Check Docker Installation') {  // New stage to check Docker installation
            steps {
                echo 'Checking Docker Installation...'
                sh 'docker --version'
                sh 'docker-compose --version'
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
                echo 'Running Unit and Integration Tests...'
                sh 'npm install'
                sh 'npm test'
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
                    sh 'docker login -u YOUR_DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD'
                    sh 'docker-compose push'
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