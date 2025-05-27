pipeline {
    agent any

    triggers {
        // Polls Git repository every 15 minutes (replace with webhook for production)
        pollSCM('H/15 * * * *')
    }

    environment {
        PATH = "/usr/local/bin:${env.PATH}"
        SONAR_TOKEN = credentials('SONAR_TOKEN')

        // Derive version from package.json dynamically
        PACKAGE_VERSION = sh(script: "node -p \"require('./backend/package.json').version\"", returnStdout: true).trim()
        IMAGE_TAG = "mern-task-manager:${PACKAGE_VERSION}-${BUILD_NUMBER}"
        GIT_TAG = "v${PACKAGE_VERSION}-${BUILD_NUMBER}"
    }

    stages {
        stage('Build') {
            steps {
                echo "Building Docker image with tag: ${IMAGE_TAG}"

                // Print version info and clean logs using timestamps
                sh '''
                    echo "===== VERSION INFO ====="
                    echo "Package Version: $PACKAGE_VERSION"
                    echo "Build Number: $BUILD_NUMBER"
                    echo "Image Tag: $IMAGE_TAG"
                    echo "========================="

                    echo "Starting Docker build..."
                    docker build -t $IMAGE_TAG ./backend 2>&1 | tee build.log
                '''
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npx jest --coverage'
                    junit 'test-results/results.xml'
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
