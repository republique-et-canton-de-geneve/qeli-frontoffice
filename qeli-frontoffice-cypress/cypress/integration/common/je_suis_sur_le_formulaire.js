import { Given } from 'cypress-cucumber-preprocessor/steps';

const url = Cypress.config('baseUrl');

Given('Je/je suis sur le formulaire', () => cy.visit(url));
