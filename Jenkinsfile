pipeline {
    agent any 

    stages {
        stage('Cleanup Old Repo') {
            steps {
                echo 'Cleaning up old repository...'
                sh 'rm -rf F21AO-Group7'
            }
        }

        stage('Clone Repository') {
            steps {
                echo 'Cloning Repository...'
                withCredentials([string(credentialsId: 'GitHub-Creds-pipeline', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                    git clone https://$GITHUB_TOKEN@github.com/harika-maha/F21AO-Group7.git
                    cd F21AO-Group7
                    git checkout G7-30-Write-tests-for-treatment-service
                    '''
                }
            }
        }

        stage('Check Docker Installation') {
            steps {
                echo 'Checking Docker Installation...'
                sh 'docker --version'
                sh 'docker-compose --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Dependencies...'
                sh '''
                npm install -g cross-env mocha nyc nodemon
                cd F21AO-Group7/Authentication-Service && npm install
                cd ../Discharge-Service && npm install
                cd ../PatientRegistration-Service && npm install
                cd ../Treatment-service && npm install
                '''
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
                echo 'Running Unit Tests for Each Service...'
                sh '''
                cd F21AO-Group7/Authentication-Service && npm run test:unit
                cd ../Discharge-Service && npm run test:unit || true
                cd ../PatientRegistration-Service && npm run test:unit || true
                cd ../Treatment-service && npm run test:unit || true
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
            sh 'docker-compose down || true'
        }
    }
}