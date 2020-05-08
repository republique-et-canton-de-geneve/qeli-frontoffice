/// <reference types="./support" />
var moment = require('moment');

function splitCommaSeparatedString(str) {
  if ([',', ';'].some(char => str.includes(char))) {
    return str.split(/[,]|[;]/);
  }

  return [str];
}

function interpolateMembreId(str) {
  let result = str;
  const demandeur = Cypress.env('demandeur');
  const membres = Cypress.env('membres');

  result = result.replace(demandeur.prenom, demandeur.id);
  membres.forEach(membre => result = result.replace(membre.prenom, membre.id));

  return result;
}

Cypress.Commands.add('dataCy', (value) => cy.get(`[data-cy=${value}]`));

Cypress.Commands.add('setDemandeur', (etastCivil, age, prenom) => {
  const dateNaissance = moment().subtract(age, 'years').format("DD.MM.YYYY");

  cy.get('[data-cy=demandeur-etat-civil] select').select(etastCivil);
  cy.get('[data-cy=demandeur-date-naissance] [data-cy=date-input]').type(dateNaissance);
  cy.get('[data-cy=demandeur-prenom] input').type(prenom);

  Cypress.env('demandeur', {id: 0, prenom: prenom});
  Cypress.env('membres', []);
});

Cypress.Commands.add('addMembre', (relation, age, prenom) => {
  const dateNaissance = moment().subtract(age, 'years').format("DD.MM.YYYY");
  const membres = Cypress.env('membres') || [];
  const currentMembreIndex = membres.length;

  cy.get(`[data-cy=membre-${currentMembreIndex}] [data-cy=relation] select`).select(relation);
  cy.get(`[data-cy=membre-${currentMembreIndex}] [data-cy=date-naissance] [data-cy=date-input]`).type(dateNaissance);
  cy.get(`[data-cy=membre-${currentMembreIndex}] [data-cy=prenom] input`).type(prenom);

  Cypress.env('membres', membres.concat({id: currentMembreIndex + 1, prenom: prenom}));
});

Cypress.Commands.add('clickNext', () => cy.get('[data-cy=nextQuestion]').click());
Cypress.Commands.add('clickPrevious', () => cy.get('[data-cy=clickPrevious]').click());

Cypress.Commands.add('getQuestion', (questionKey) => cy.get(`[data-cy-question=${interpolateMembreId(questionKey)}]`));
Cypress.Commands.add('getQuestionLabel', (questionKey) =>
  cy.getQuestion(questionKey).getAttribute('data-cy-question-label')
);
Cypress.Commands.add('answerNationalite', (question, answer) => {
  cy.getQuestion(questionKey).find('[data-cy-question-input]').then($question => {
    $question[0].getAttribute('data-cy-question-type').should('be', 'nationalite');

    if (answer === 'apatride') {
      cy.dataCy('apatride').check();
    } else {
      const nationalites = splitCommaSeparatedString(answer);
      nationalites.forEach((nationalite, i) => {
        cy.dataCy(`select_nationalite_${i}`).select(nationalite);
        if (i < nationalites.length - 1) {
          cy.dataCy(`ajouter_nationalite_${i}`).should('not.be.disabled').click();
        }
      });
    }
  });
});
Cypress.Commands.add('answerQuestion', (questionKey, answer, submit = true) => {
  cy.getQuestion(questionKey).find('[data-cy-question-input]').then($question => {
    const type = $question[0].getAttribute('data-cy-question-type');

    if (type === 'checkbox-group') {
      splitCommaSeparatedString(answer).forEach(
        value => {
          if (questionKey === '0101_prestations') {
            cy.wrap($question[0]).find(`input[value=${interpolateMembreId(value)}]`).check();
          } else {
            cy.wrap($question[0]).find(`input[value=${value}]`).check();
          }
        }
      );
    } else if (type === 'date') {
      if (/\d{2}\.\d{2}\.\d{4}/.test(answer)) {
        cy.wrap($question[0]).find(`[data-cy=date-input]`).type(answer);
      } else {
        cy.wrap($question[0]).find(`input[value=${answer}]`).check();
      }
    } else if (type === 'nationalite') {
      cy.answerNationalite(questionKey, answer);
    } else if (type === 'dropdown' || type === 'taux') {
      cy.wrap($question[0]).find(`select`).select(answer);
    } else {
      cy.wrap($question[0]).find(`input`).type(answer);
    }

    if (submit) {
      cy.clickNext();
    }
  });
});
Cypress.Commands.add('answerYearsQuestion', (question, years, submit = true) => {
  cy.dataCy(question).find('[data-cy-question-input]').then($question => {
    $question[0].getAttribute('data-cy-question-type').should('be', 'date');

    const dateAnswer = moment().subtract(years, 'years').format("DD.MM.YYYY");
    cy.wrap($question[0]).find('[data-cy=date-input]').type(dateAnswer);

    if (submit) {
      cy.clickNext();
    }
  });
});

Cypress.Commands.add('isPrestationInStatus', (prestations, status) =>
  splitCommaSeparatedString(prestations).forEach(
    prestation => cy.get(`[data-cy-${status}=${prestation}]`).should('exist')
  )
);




