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
    // Node
    NODEJS_HOME = tool name: 'NodeJS 11.15.0', type: 'nodejs'

    // Proxy
    HTTP_PROXY = '***REMOVED***'
    HTTPS_PROXY = '***REMOVED***'
    NO_PROXY = '***REMOVED***'

    // Cypress
    CYPRESS_CACHE_FOLDER = '***REMOVED***'
    CYPRESS_INSTALL_BINARY = '3.8.2'

    // LAB credentials
    QELI_LAB_HOST = '***REMOVED***'
    QELI_LAB_CREDENTIALS = credentials('45d84cd5-cffc-429c-8ec8-a1a8852ed903')

    // DEV credentials
    QELI_DEV_A_HOST = 'RH712TOMC75A'
    QELI_DEV_B_HOST = 'RH712TOMC75B'
    QELI_DEV_CREDENTIALS = credentials('38c09e92-ea6a-4e8f-9d31-8ef1aa27be97')
  }

  tools {
    jdk 'Java 1.8'
    maven 'Maven 3.2.1'
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
      when { expression { return false } }
      // TODO Problème dans l'agent Cypress
      // when { branch 'develop' }

      steps {
        withSonarQubeEnv('Sonarqube') {
          sh "mvn ${env.SONAR_MAVEN_GOAL} -Dsonar.host.url=${env.SONAR_HOST_URL} \
                                          -pl '!qeli-frontoffice-cypress'        \
                                          -Pci"
        }
      }
    }

    stage('Integration tests') {
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

    stage('Deploy') {
      parallel {
        stage('LAB') {
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
                     from: './qeli-frontoffice-application/target/qeli-frontoffice-application-*.war',
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

        stage('DEV A') {
          when { branch 'master' }

          steps {
            script {
              def remote = [:]
              remote.name = 'qeli-dev'
              remote.host = env.QELI_DEV_A_HOST
              remote.user = env.QELI_DEV_CREDENTIALS_USR
              remote.password = env.QELI_DEV_CREDENTIALS_PSW
              remote.allowAnyHosts = true

              sshPut remote: remote,
                     from: './qeli-frontoffice-application/target/qeli-frontoffice-application-*.war',
                     into: "***REMOVED***/webapps/livraison/",
                     override: true

              sshScipt remote: remote,
                       script: './qeli-frontoffice-application/src/distrib/dev-deploy.sh'
            }
          }
        }

        stage('DEV B') {
          when { branch 'master' }

          steps {
            script {
              def remote = [:]
              remote.name = 'qeli-dev'
              remote.host = env.QELI_DEV_B_HOST
              remote.user = env.QELI_DEV_CREDENTIALS_USR
              remote.password = env.QELI_DEV_CREDENTIALS_PSW
              remote.allowAnyHosts = true

              sshPut remote: remote,
                     from: './qeli-frontoffice-application/target/qeli-frontoffice-application.war',
                     into: "***REMOVED***/webapps/livraison/",
                     override: true

              sshScipt remote: remote,
                       script: './qeli-frontoffice-application/src/distrib/dev-deploy.sh'
            }
          }
        }
      }

    }
  }
}
