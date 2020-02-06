pipeline {
  agent {
    node {
      label 'CypressAgent'
    }
  }
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }
  environment {
    HTTP_PROXY = '***REMOVED***'
    HTTPS_PROXY = '***REMOVED***'
    NO_PROXY = '***REMOVED***'
    QELI_LAB_HOST = '***REMOVED***'
    QELI_CREDENTIALS = credentials('45d84cd5-cffc-429c-8ec8-a1a8852ed903')
    NODEJS_HOME = tool name: 'NodeJS 11.15.0', type: 'nodejs'
    CYPRESS_CACHE_FOLDER = '***REMOVED***'
    CYPRESS_INSTALL_BINARY = '3.8.2'
  }
  tools {
    maven 'Maven 3.2.1'
    jdk 'Java 1.8'
    nodejs 'NodeJS 11.15.0'
  }
  stages {
    stage('Build') {
      steps {
        sh "mvn clean package -s ${env.USER_SETTINGS_DIR}social_settings.xml \
                              -pl '!qeli-frontoffice-cypress'                \
                              -Dihm.test.skip=true                           \
                              -Pci"

        junit '**/target/surefire-reports/*.xml'
        step([$class: 'JacocoPublisher'])
      }
    }

    stage('Sonar') {
      when { branch 'develop' }

      steps {
        withSonarQubeEnv('Sonarqube') {
          sh "mvn ${env.SONAR_MAVEN_GOAL} -Dsonar.host.url=${env.SONAR_HOST_URL} \
                                          -pl '!qeli-frontoffice-cypress'        \
                                          -Pci"
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

    stage('Integration tests') {
      when { expression { return false } }
      steps {
        sh "mvn verify -s ${env.USER_SETTINGS_DIR}social_settings.xml \
                       -Dihm.test.skip=true                           \
                       -Dsurefire.test.skip=true                      \
                       -Pci"
      }
    }

    stage('Deploy artifact') {
      when {
        anyOf {
          branch 'develop'
          branch 'master'
        }
      }

      steps {
        sh "mvn clean source:jar deploy -s ${env.USER_SETTINGS_DIR}social_settings.xml -DskipTests=true  \
                                        -pl '!qeli-frontoffice-cypress'                                  \
                                        -Pci"
      }
    }
  }
}
