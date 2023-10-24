/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

  cy.get('[data-cy=ajouter-membre]').click();
  cy.get(`[data-cy=membre-${currentMembreIndex}] [data-cy=membre-relation] select`).select(relation);
  cy.get(`[data-cy=membre-${currentMembreIndex}] [data-cy=membre-date-naissance] [data-cy=date-input]`).type(
    dateNaissance);
  cy.get(`[data-cy=membre-${currentMembreIndex}] [data-cy=membre-prenom] input`).type(prenom);

  Cypress.env('membres', membres.concat({id: currentMembreIndex + 1, prenom: prenom}));
});

Cypress.Commands.add('clickNext', () => cy.get('[data-cy=nextQuestion]').click());
Cypress.Commands.add('clickPrevious', () => cy.get('[data-cy=clickPrevious]').click());

Cypress.Commands.add('getQuestion', (questionKey) => cy.get(`[data-cy-question=${interpolateMembreId(questionKey)}]`));
Cypress.Commands.add('getQuestionLabel', (questionKey) =>
  cy.getQuestion(questionKey).getAttribute('data-cy-question-label')
);
Cypress.Commands.add('answerNationalite', (questionKey, answer) => {
  cy.getQuestion(questionKey).find('[data-cy-question-input]').then($question => {
    if (answer === 'apatride') {
      cy.wrap($question[0]).find('input[data-cy=apatride]').check();
    } else {
      const nationalites = splitCommaSeparatedString(answer);
      nationalites.forEach((nationalite, i) => {
        cy.wrap($question[0]).find(`select[data-cy=nationalite-${i}]`).select(nationalite);
        if (i < nationalites.length - 1) {
          cy.wrap($question[0]).find(`button[data-cy=ajouter-nationalite-${i}]`).should('not.be.disabled').click();
        }
      });
    }
  });
});
Cypress.Commands.add('answerQuestion', (questionKey, answer, submit = true) => {
  cy.getQuestion(questionKey).find('[data-cy-question-input]').then($question => {
    const type = $question[0].getAttribute('data-cy-question-type');

    if (type === 'checkbox-group') {
      if (answer === 'NON' || answer === 'INCONNU') {
        cy.wrap($question[0]).find(`input[data-cy-value=${answer}]`).check();
      } else {
        splitCommaSeparatedString(answer).forEach(
          value => {
            cy.wrap($question[0]).find('input[data-cy-value=OUI]').check();
            if (questionKey === '0101_prestations') {
              cy.wrap($question[0]).find(`input[value=${interpolateMembreId(value)}]`).check();
            } else {
              cy.wrap($question[0]).find(`input[value=${value}]`).check();
            }
          }
        );
      }
    } else if (type === 'date') {
      if (/\d{2}\.\d{2}\.\d{4}/.test(answer)) {
        cy.wrap($question[0]).find('[data-cy=date-input]').type(answer);
      } else {
        cy.wrap($question[0]).find(`input[data-cy-value=${answer}]`).check();
      }
    } else if (type === 'nationalite') {
      cy.answerNationalite(questionKey, answer);
    } else if (type === 'dropdown') {
      cy.wrap($question[0]).find('select').select(answer);
    } else if (type === 'taux') {
      cy.wrap($question[0]).find('input[type=number]').first().type(answer);
    } else if (type === 'radio') {
      cy.wrap($question[0]).find(`input[data-cy-value=${answer}]`).check();
    } else {
      cy.wrap($question[0]).find('input').type(answer);
    }

    if (submit) {
      cy.clickNext();
    }
  });
});

Cypress.Commands.add('answerYearsQuestion', (questionKey, years, submit = true) => {
  cy.dataCy(questionKey).find('[data-cy-question-input]').then($question => {
    $question[0].getAttribute('data-cy-question-type').should('be', 'date');

    const dateAnswer = moment().subtract(years, 'years').format("DD.MM.YYYY");
    cy.wrap($question[0]).find('[data-cy=date-input]').type(dateAnswer);

    if (submit) {
      cy.clickNext();
    }
  });
});

Cypress.Commands.add('isPrestationInStatus', (prestations, status) =>
  splitCommaSeparatedString(interpolateMembreId(prestations)).forEach(
    prestation => cy.get(`[data-cy-${status}=${prestation}]`).should('exist')
  )
);




