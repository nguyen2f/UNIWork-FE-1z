pipeline {
    agent any

    environment {
        APP_NAME = 'uniwork-frontend'
        IMAGE_NAME = 'uniwork-frontend:latest'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo '=== Stage 1: Checking out Frontend source code ==='
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '=== Stage 2: Installing dependencies with pnpm ==='
                sh 'npm install -g pnpm@9'
                sh 'pnpm install --frozen-lockfile'
            }
        }

        stage('TypeScript Static Check') {
            steps {
                echo '=== Stage 3: Running strict TypeScript type checking ==='
                sh 'npx tsc --noEmit'
            }
        }

        stage('Next.js Production Build') {
            steps {
                echo '=== Stage 4: Building Next.js production bundle ==='
                sh 'pnpm run build'
            }
        }

        stage('Build Docker Standalone') {
            steps {
                echo '=== Stage 5: Building Next.js standalone container image ==='
                sh 'docker build -t ${IMAGE_NAME} .'
            }
        }

        stage('Container Verification') {
            steps {
                echo '=== Stage 6: Inspecting Docker image footprint ==='
                sh 'docker image inspect ${IMAGE_NAME} --format "{{.Id}}: {{.Size}} bytes"'
            }
        }
    }

    post {
        success {
            echo "✅ Frontend Pipeline #${env.BUILD_NUMBER} completed successfully!"
        }
        failure {
            echo "❌ Frontend Pipeline #${env.BUILD_NUMBER} failed! Check console output."
        }
    }
}
