/// <reference types="./support" />
var moment = require('moment');

const NUMBERBOX = 'input[type=number]';
const TEXTBOX = 'input[type=text]';
const RADIO = 'input[type=radio]';
const CHECKBOX = 'input[type=checkbox]';
const SELECT = 'select';

const url = Cypress.config('baseUrl');

Cypress.Commands.add('dataCy', (value) => cy.get(`[data-cy=${value}]`));

Cypress.Commands.add('dataCyLabel', (value) => cy.get(`[data-cy-label=${value}]`));

Cypress.Commands.add('getPrestationParEligibilite', (eligibilite, prestation) => {
  cy.get(`[data-cy-${eligibilite}=${prestation}]`);
});

Cypress.Commands.add('checkStatutPrestation', (statut, prestation) => {
  if ([',', ';'].some(char => prestation.includes(char))) {
    const prestations = prestation.split(/[,]|[;]/);
    prestations.forEach((presta, i) => {
      cy.getPrestationParEligibilite(statut, presta).should('exist')
    });
  } else {
    cy.getPrestationParEligibilite(statut, prestation).should('exist')
  }
});

Cypress.Commands.add('clickNext', () => cy.get('[data-cy=nextQuestion]').should('not.be.disabled').click());

Cypress.Commands.add('clickPrevious', () => cy.get('[data-cy=clickPrevious]').click());

Cypress.Commands.add('connectionFormulaire', () => cy.visit(url));

Cypress.Commands.add('answerNationalite', (question, answer) => {
  if ([',', ';'].some(char => answer.includes(char))) {
    const nationalites = answer.split(/[,]|[;]/);
    nationalites.forEach((nationalite, i) => {
      cy.get(`[data-cy=${question}_select_nationalite_${i}]`).select(nationalite);
      if (i < nationalites.length - 1) {
        cy.get(`[data-cy=${question}_ajouter_nationalite_${i}]`).should('not.be.disabled').click();
      }
    });
  } else if (answer === 'apatride') {
    cy.get(`[data-cy=${question}_checkbox_apatride]`).check();
  } else {
    cy.get(`[data-cy=${question}_select_nationalite_0]`).select(answer);
  }
});

Cypress.Commands.add('answerQuestion', (question, answer, validate) => {

  cy.dataCy(question).then(($elem) => {
    if (answer.trim().length > 0) {
      if ($elem[0].getAttribute('data-cy-type') === 'nationalite') {
        cy.answerNationalite(question, answer);
      } else if ($elem.find(CHECKBOX).length > 0) {
        if ([',', ';'].some(char => answer.includes(char))) { // handle array of string (multiple answers)
          answer.split(/[,]|[;]/).forEach((option) => cy.get('[data-cy=' + option + ']').check());
        } else {
          cy.dataCy(answer).check();
        }
      } else if ($elem[0].getAttribute('data-cy-type') === 'date') {
        if (/\d{2}\.\d{2}\.\d{4}/.test(answer)) {
          cy.dataCy('date-input').type(answer);
        } else {
          console.log("ANSWER");
          cy.dataCy(answer).check();
        }
      } else if ($elem.find(RADIO).length) {
        cy.dataCy(answer).check();
      } else if ($elem[0].type === 'select-one') {
        cy.get(SELECT).select(answer);
      } else {
        cy.wrap($elem).type(answer);
      }
    }

    if (validate) {
      cy.clickNext();
    }

  });
});

Cypress.Commands.add('answerYearsQuestion', (question, years, validate) => {
  cy.dataCy(question).then(($elem) => {
    if ($elem[0].getAttribute('data-cy-type') === 'date') {
      const dateAnswer = moment().subtract(years, 'years').format("DD.MM.YYYY");
      cy.dataCy('date-input').type(dateAnswer);
    }

    if (validate) {
      cy.clickNext();
    }

  });
});
