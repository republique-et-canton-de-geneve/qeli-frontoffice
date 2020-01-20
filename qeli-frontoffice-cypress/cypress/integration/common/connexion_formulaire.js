import { Given } from "cypress-cucumber-preprocessor/steps";

const url = Cypress.config('baseUrl');
Given('Je me connecte au formulaire', () => {
    cy.visit(url)
});
