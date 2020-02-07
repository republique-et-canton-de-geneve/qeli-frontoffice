// ***********************************************************
// Plugins file
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const cucumber = require('cypress-cucumber-preprocessor').default;
const fs = require('fs-extra');
const path = require('path');

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress/config/', `cypress.${file || 'default'}.json`);
  return fs.readJson(pathToConfigFile);
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Register cucumber preprocessor
  on('file:preprocessor', cucumber());

  // Resolve the configuration file
  return getConfigurationByFile(config.env['qeli-env']);
};
