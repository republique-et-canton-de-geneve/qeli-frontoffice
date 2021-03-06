/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


def getCypressCacheFolder() {
    configFileProvider([
      configFile(fileId: 'a625574f-5000-45c1-8bce-929ea9eacf59', variable: 'PRIVATE_PROPERTIES')
    ]) {
      def privateProps = readProperties file: "$PRIVATE_PROPERTIES"
      return privateProps['CYPRESS_CACHE_FOLDER'];
    }
}

pipeline {
  agent { label 'master' }

  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
  }

  environment {
    // Node
    NODEJS_HOME = tool name: 'NodeJS 11.15.0', type: 'nodejs'

    // Cypress
    CYPRESS_CACHE_FOLDER = getCypressCacheFolder()
    CYPRESS_INSTALL_BINARY = '3.8.2'

    // DEV credentials
    QELI_DEV_CREDENTIALS = credentials('38c09e92-ea6a-4e8f-9d31-8ef1aa27be97')
  }

  tools {
    jdk 'Java 1.8'
    // TODO Migrate Maven 3.6.1 to add --no-transfer-progress
    maven 'Maven 3.2.1'
    nodejs 'NodeJS 11.15.0'
  }

  stages {
    stage('Build') {
      steps {
        sh "mvn clean verify -s ${env.USER_SETTINGS_DIR}social_settings.xml \
                             -pl '!qeli-frontoffice-cypress'                \
                             -Dihm.test.skip=true                           \
                             -Pci,ocsin"

        junit '**/target/surefire-reports/*.xml'
        step([$class: 'JacocoPublisher'])
      }
    }

    stage('Deploy') {
      parallel {
        stage('DEV Instance A') {
          when { branch 'develop' }

          steps {
            script {
              configFileProvider([
                configFile(fileId: 'a625574f-5000-45c1-8bce-929ea9eacf59', variable: 'PRIVATE_PROPERTIES')
              ]) {
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
              configFileProvider([
                configFile(fileId: 'a625574f-5000-45c1-8bce-929ea9eacf59', variable: 'PRIVATE_PROPERTIES')
              ]) {
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

    stage('Sonar') {
      when { branch 'develop' }

      steps {
        withSonarQubeEnv('Sonarqube') {
          sh "mvn ${env.SONAR_MAVEN_GOAL} -Dsonar.host.url=${env.SONAR_HOST_URL} \
                                          -pl '!qeli-frontoffice-cypress'        \
                                          -Pci,ocsin"
        }
      }
    }

    stage('Integration tests') {
      agent { label 'CypressAgent' }
      when { branch 'develop' }

      steps {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          sh "mvn verify -s ${env.USER_SETTINGS_DIR}social_settings.xml \
                         -Dihm.test.skip=true                           \
                         -Dsurefire.test.skip=true                      \
                         -Pci,ocsin"
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
                                        -Pci,ocsin"
      }
    }
  }
}
