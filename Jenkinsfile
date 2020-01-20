pipeline {
  agent { label 'master' }
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    HTTP_PROXY = '***REMOVED***'
    HTTPS_PROXY = '***REMOVED***'
    NO_PROXY = '***REMOVED***'
    QELI_LAB_HOST = '***REMOVED***'
    QELI_CREDENTIALS = credentials('45d84cd5-cffc-429c-8ec8-a1a8852ed903')
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
        withSonarQubeEnv('Sonarqube') {
          sh "mvn ${env.SONAR_MAVEN_GOAL} -Dsonar.host.url=${env.SONAR_HOST_URL}"
        }
      }
    }

    stage('Deploy') {
      when { branch 'develop' }

      steps {
        script {
          def remote = [:]
          remote.name = 'qeli-lab'
          remote.host = env.QELI_LAB_HOST
          remote.user = env.QELI_CREDENTIALS_USR
          remote.password = env.QELI_CREDENTIALS_PSW
          remote.allowAnyHosts = true

          sshPut remote: remote,
                 from: './qeli-frontoffice-application/target/qeli-frontoffice-application.war',
                 into: "/home/${remote.user}/qeli-frontoffice-application.war",
                 override: true

          sshPut remote: remote,
                 from: './qeli-frontoffice-application/src/distrib/lab-deploy.sh',
                 into: "/home/${remote.user}/deploy.sh",
                 override: true

          sshCommand remote: remote,
                     command: "cd /home/${remote.user}/ && sh ./deploy.sh </dev/null >./qeli-frontoffice.log 2>&1 &"
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
