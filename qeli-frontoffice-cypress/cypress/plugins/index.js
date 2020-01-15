// ***********************************************************
// Plugins file
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const cucumber = require('cypress-cucumber-preprocessor').default
const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress/config/', `cypress.${file}.json`)
  //console.log(pathToConfigFile)
  return fs.readJson(pathToConfigFile)
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('file:preprocessor', cucumber())

  // accept a configFile value or use development by default
  const file = config.env.configFile || 'dev'

  return getConfigurationByFile(file)
}
