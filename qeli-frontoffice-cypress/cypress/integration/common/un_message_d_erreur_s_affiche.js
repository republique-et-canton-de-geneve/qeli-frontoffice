import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('Un/un message d\'erreur {string} s\'affiche',
     (message) => cy.dataCyLabel('validation_message').should('contain', message)
);
