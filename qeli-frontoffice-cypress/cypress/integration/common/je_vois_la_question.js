import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('Je/je vois la question {string} {string}',
     (codeKey, title) => cy.dataCyLabel(codeKey).should('contain', title)
);
