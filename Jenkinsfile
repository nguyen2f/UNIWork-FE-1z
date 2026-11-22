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
                sh 'pnpm install --frozen-lockfile=false'
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

        stage('Deploy to Vercel') {
            when {
                expression { env.VERCEL_DEPLOY_HOOK != null && env.VERCEL_DEPLOY_HOOK != '' }
            }
            steps {
                echo '=== Stage 7: All checks passed. Triggering Vercel Production Deployment ==='
                sh 'curl -X POST "${VERCEL_DEPLOY_HOOK}"'
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
