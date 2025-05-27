pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:${env.PATH}"
        SONAR_TOKEN = credentials('SONAR_TOKEN')
    }

    stages {
        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npx jest'
                }
            }
        }

        stage('Code Quality') {
            steps {
                sh '''
                    sonar-scanner \
                      -Dsonar.projectKey=nirmalsubashanaD \
                      -Dsonar.organization=nirmalsubashanad \
                      -Dsonar.host.url=https://sonarcloud.io \
                      -Dsonar.login=$SONAR_TOKEN
                 '''

            }
        }

        stage('Security') {
            steps {
                sh 'snyk test'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }

        stage('Release') {
            steps {
                sh 'echo "Tagged release v1.0"'
            }
        }

        stage('Monitoring') {
            steps {
                sh './monitor.sh'
            }
        }
    }
}
