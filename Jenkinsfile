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
                    sh 'npm ci'  // cleaner & faster than npm install in CI
                    // Run Jest tests with coverage, output JUnit XML for Jenkins to pick up
                    sh 'npx jest --coverage --runInBand --bail --testResultsProcessor=jest-junit || true'
                    junit 'test-results/results.xml'
                }
            }
        }

        stage('Code Quality') {
            steps {
                script {
                    try {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=nirmalsubashanaD \
                              -Dsonar.organization=nirmalsubashanad \
                              -Dsonar.host.url=https://sonarcloud.io \
                              -Dsonar.login=$SONAR_TOKEN
                        '''
                    } catch (err) {
                        echo "SonarQube scan failed but build will continue: ${err}"
                        currentBuild.result = 'UNSTABLE' // mark unstable but not fail
                    }
                }
            }
        }

        stage('Security') {
            steps {
                dir('backend') {
                    sh 'npm install snyk --no-save'
                    sh './node_modules/.bin/snyk test || echo "Snyk scan completed with issues (non-blocking)"'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Stopping and removing previous containers (if any)..."
                sh 'docker-compose down || true'

                echo "Deploying containers..."
                sh 'docker-compose up -d --build'
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
