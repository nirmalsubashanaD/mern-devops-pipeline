pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:${env.PATH}"
        SONAR_TOKEN = credentials('SONAR_TOKEN')
        IMAGE_TAG = "mern-task-manager:${BUILD_NUMBER}"
        GIT_TAG = "v1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('Build') {
            steps {
                echo "Building Docker image with tag: ${IMAGE_TAG}"
                sh "docker build -t ${IMAGE_TAG} ./backend"
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npx jest --coverage'
                    junit 'coverage/*.xml'
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
                dir('backend') {
                    sh 'npm install snyk --save-dev'
                    sh './node_modules/.bin/snyk test || echo "Snyk scan completed with issues (non-blocking)"'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying containers..."
                sh 'docker-compose up -d'
            }
        }

        stage('Release') {
            steps {
                echo "Tagging the release in Git as ${GIT_TAG}"
                withCredentials([usernamePassword(credentialsId: 'github-jenkins-token', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                    sh '''
                        git config --global user.email jenkins@example.com
                        git config --global user.name "Jenkins CI"
                        git tag -d ${GIT_TAG} || true
                        git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/nirmalsubashanaD/mern-devops-pipeline.git :refs/tags/${GIT_TAG} || true
                        git tag -a ${GIT_TAG} -m 'Automated release from Jenkins'
                        git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/nirmalsubashanaD/mern-devops-pipeline.git ${GIT_TAG}
                    '''
                }
            }
        }

        stage('Monitoring') {
            steps {
                sh './monitor.sh || echo "Monitoring script executed with warnings"'
            }
        }
    }

    post {
        always {
            echo "Pipeline completed for build #${BUILD_NUMBER}"
        }
    }
}
