pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/stoychoenchev/playwrightAPI.git'
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run tests') {
            steps {
                // Run tests with configured reporters from playwright.config.js
                bat 'npx playwright test'
            }
        }
        
        stage('Clean') {
    steps {
        bat 'rmdir /s /q playwright-report'
        bat 'rmdir /s /q test-results'
    }
}

    }

    post {
        always {
            // Archive HTML report
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

            // Publish JUnit test results to Jenkins
            junit 'test-results/**/*.xml'
        }
    }
}
