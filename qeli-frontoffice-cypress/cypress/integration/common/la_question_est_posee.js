import {Then} from "cypress-cucumber-preprocessor/steps";

Then(`La question {string} est posée`, (codeKey) =>
  cy.get(`label[for="${codeKey}"`).should('be.visible')
);

Then(`La question {string} n'est pas posée`, (codeKey) =>
  cy.get(`label[for="${codeKey}"`).should('not.be.visible')
);
