pipeline {
  agent { label 'master' }

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

    // DEV credentials
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
      when { branch 'develop' }

      steps {
        withSonarQubeEnv('Sonarqube') {
          sh "mvn ${env.SONAR_MAVEN_GOAL} -Dsonar.host.url=${env.SONAR_HOST_URL} \
                                          -pl '!qeli-frontoffice-cypress'        \
                                          -Pci"
        }
      }
    }

    stage('Integration tests') {
      agent { label 'CypressAgent' }

      steps {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          sh "mvn verify -s ${env.USER_SETTINGS_DIR}social_settings.xml \
                         -Dihm.test.skip=true                           \
                         -Dsurefire.test.skip=true                      \
                         -Pci"
        }
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
        stage('DEV Instance A') {
          when { branch 'develop' }

          steps {
            script {
             configFileProvider([configFile(fileId: 'a625574f-5000-45c1-8bce-929ea9eacf59', variable: 'PRIVATE_PROPERTIES')]) {
              def privateProps = readProperties file: "$PRIVATE_PROPERTIES"

              def remote = [:]
              remote.name = 'qeli-dev'
              remote.host = privateProps['QELI_DEV_A_HOST']
              remote.user = env.QELI_DEV_CREDENTIALS_USR
              remote.password = env.QELI_DEV_CREDENTIALS_PSW
              remote.allowAnyHosts = true

              sshPut remote: remote,
                     from: './qeli-frontoffice-application/target/qeli-frontoffice-application.war',
                     into: '***REMOVED***/livraison/qeli-frontoffice-application.war',
                     override: true

              sshScript remote: remote,
                        script: './qeli-frontoffice-application/src/distrib/dev-deploy.sh'
            }
           }
          }
        }

        stage('DEV Instance B') {
          when { branch 'develop' }

          steps {
            script {
             configFileProvider([configFile(fileId: 'a625574f-5000-45c1-8bce-929ea9eacf59', variable: 'PRIVATE_PROPERTIES')]) {
              def privateProps = readProperties file: "$PRIVATE_PROPERTIES"

              def remote = [:]
              remote.name = 'qeli-dev'
              remote.host = privateProps['QELI_DEV_B_HOST']
              remote.user = env.QELI_DEV_CREDENTIALS_USR
              remote.password = env.QELI_DEV_CREDENTIALS_PSW
              remote.allowAnyHosts = true

              sshPut remote: remote,
                     from: './qeli-frontoffice-application/target/qeli-frontoffice-application.war',
                     into: '***REMOVED***/livraison/qeli-frontoffice-application.war',
                     override: true

              sshScript remote: remote,
                        script: './qeli-frontoffice-application/src/distrib/dev-deploy.sh'
            }
           }
          }
        }
      }
    }
  }
}
