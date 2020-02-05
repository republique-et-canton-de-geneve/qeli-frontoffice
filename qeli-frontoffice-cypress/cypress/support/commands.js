/// <reference types="./support" />

const TEXTBOX = 'input[type=text]';
const RADIO = 'input[type=radio]';
const CHECKBOX = 'input[type=checkbox]';
const DATE = 'input[type=date]';
const SELECT = 'select';

const url = Cypress.config('baseUrl');

Cypress.Commands.add('dataCy', (value) => cy.get(`[data-cy=${value}]`));

Cypress.Commands.add('dataCyLabel', (value) => cy.get(`[data-cy-label=${value}]`));

Cypress.Commands.add('getPrestationParEligibilite', (eligibilite, prestation) => {
  cy.get(`[data-cy-${eligibilite}=${prestation}]`);
});

Cypress.Commands.add('isPrestationHasEtat', (etat, prestation) => {
  if (prestation.indexOf(';') !== -1) {
    const prestations = prestation.split(';');
    prestations.forEach((presta, i) => {
      cy.getPrestationParEligibilite(etat, presta).should('be.visible')
    });
  } else {
    cy.getPrestationParEligibilite(etat, prestation).should('be.visible')
  }
});

Cypress.Commands.add('isPrestationEligible', (prestation) => {
  cy.isPrestationHasEtat(Cypress.env('PRESTATIONS_ELIGIBLES'), prestation);
});
Cypress.Commands.add('isPrestationRefusee', (prestation) => {
  cy.isPrestationHasEtat(Cypress.env('PRESTATIONS_REFUSEES'), prestation);
});
Cypress.Commands.add('isPrestationPercue', (prestation) => {
  cy.isPrestationHasEtat(Cypress.env('PRESTATIONS_PERCUES'), prestation);
});

Cypress.Commands.add('clickNext', () => cy.get('[data-cy=nextQuestion]').should('not.be.disabled').click());

Cypress.Commands.add('clickPrevious', () => cy.get('[data-cy=clickPrevious]').click());

Cypress.Commands.add('connectionFormulaire', () => cy.visit(url));

Cypress.Commands.add('answerNationalite', (question, answer) => {
  if (answer.indexOf(',') !== -1) {
    const nationalites = answer.split(',');
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
      } else if ($elem.find(CHECKBOX).length) {
        if (answer.indexOf(',') !== -1) { // handle array of string (multiple answers)
          answer.split(',').forEach((option) => cy.get('[data-cy=' + option + ']').check());
        } else if (answer.indexOf(';') !== -1) { // handle array of string (multiple answers)
          answer.split(';').forEach((option) => cy.get('[data-cy=' + option + ']').check());
        } else {
          cy.dataCy(answer).check();
        }
      } else if ($elem.find(RADIO).length) {
        cy.dataCy(answer).check();
      } else if ($elem[0].type === 'select-one') {
        cy.get(SELECT).select(answer);
      } else if ($elem[0].type === 'date') {
        cy.get(DATE).type(answer);
      } else if ($elem[0].type === 'text') {
        cy.get(TEXTBOX).type(answer);
      } else {
        cy.wrap($elem).type(answer);
      }
    }

    if (validate) {
      cy.clickNext();
    }

  });
});
