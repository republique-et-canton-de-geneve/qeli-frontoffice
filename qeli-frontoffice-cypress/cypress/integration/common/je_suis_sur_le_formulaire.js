import { Given } from "cypress-cucumber-preprocessor/steps";

const url = Cypress.config('baseUrl');

Given(`Je suis sur le formulaire`, () => cy.visit(url));
