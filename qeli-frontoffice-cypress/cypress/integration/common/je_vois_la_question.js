import { Then } from "cypress-cucumber-preprocessor/steps";

Then(`Je vois la question {string} {string}`,
     (codeKey, title) => cy.get(`label[for="${codeKey}"`).should('contain', title)
);
