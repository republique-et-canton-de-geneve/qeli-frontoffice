import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('La/la prestation {string} est {string}', (codePrestation, possibleImpossible) => {
  // TODO Implementer avec cy.checkStatutPrestation
  console.log(codePrestation + ' ' + possibleImpossible);
  cy.get('body').should('be.visible');
});
