pipeline {
  agent { label 'master' }
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    HTTP_PROXY = '***REMOVED***'
    HTTPS_PROXY = '***REMOVED***'
    NO_PROXY = '***REMOVED***'
  }
  tools {
    maven 'Maven 3.2.1'
    jdk 'Java 1.8'
  }
  stages {
    stage('Build') {
      steps {
        sh "mvn clean source:jar deploy -s ${env.USER_SETTINGS_DIR}social_settings.xml -Dihm.test.skip=true"
        junit '**/target/surefire-reports/*.xml'
        step([$class: 'JacocoPublisher'])
      }
    }
    stage('Sonar') {
      when { branch 'develop' }

      steps {
        withSonarQubeEnv("Sonarqube") {
          sh "mvn ${env.SONAR_MAVEN_GOAL} -Dsonar.host.url=${env.SONAR_HOST_URL}"
        }
      }
    }
    stage('Cypress Verify') {
      steps {
        sh "cd qeli-frontoffice-cypress && npm run cy:verify"
      }
    }
    stage('Cypress Tests') {
      steps {
        sh "cd qeli-frontoffice-cypress && nohup npm run start:ci & npm run cy:run:ci"
      }
    }
  }
}
