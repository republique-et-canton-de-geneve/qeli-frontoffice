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

import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { PrestationStatus } from "../../support/commands/prestation-status";

// Given statements
Given('Je/je suis sur le formulaire',
      () => cy.visit(Cypress.config('baseUrl')));
Given("Je/je suis {string}(,) j'ai {int} an(s) et je m'appelle {string}",
      (etatCivil, age, prenom) => cy.setDemandeur(etatCivil, age, prenom));
Given("J/j(')ai un/une {string}(,) qui a {int} an(s) et il/elle s'appelle {string}",
      (relation, age, prenom) => cy.addMembre(relation, age, prenom));

// When statements
When('Je/je passe à/a la question suivante', () => cy.clickNext());
When('Je/je reviens à/a la question précédente/precedente', () => cy.clickPrevious());
When('A/a/à la question {string}(,) je réponds/coche {string}',
     (question, answer) => cy.answerQuestion(question, answer));
When('A/a/à la question {string}(,) je réponds/coche {string} sans validation',
     (question, answer) => cy.answerQuestion(question, answer, false));
When('A/a/à la question {string}(,) je remplis:',
     (question, dataTable) => {
       const answers = dataTable.raw();

       answers.forEach((answer, index) => {
         const isLast = index === answers.length - 1;
         cy.answerQuestion(answer[0], answer[1], isLast);
       });
     }
);

When('A/a/à la question {string}(,) je remplis \\(sans validation\\) :',
     (question, dataTable) => {
       const answers = dataTable.raw();
       answers.forEach((answer) => cy.answerQuestion(answer[0], answer[1], false));
     }
);
When('A/a/à la question {string}(,) je réponds {int} ans',
     (question, years) => cy.answerYearsQuestion(question, years, true));
When('A/a/à la question {string}(,) je réponds {int} ans sans validation',
     (question, years) => cy.answerYearsQuestion(question, years, false));

// Then statements
Then('Je/je vois la question {string} {string}',
     (questionKey, title) => cy.getQuestionLabel(questionKey).should('contain', title)
);

// TODO c'est la même chose que la précedent mais avec moins de validation.
Then('La/la question {string} est posée',
     (question) => cy.getQuestion(question).should('be.visible')
);

// TODO C'est trop dangereux, la question peut ne pas arrivé à cause d'un bug (e.g. une nouvelle question arriven avant)
//  ce statement serait toujours valide.
Then("La/la question {string} (n')est pas posée",
     (question) => cy.getQuestion(question).should('not.be.visible'));
Then("Un/un message d'erreur {string} s'affiche",
     (message) => cy.dataCy('validation_message').should('contain', message)
);
Then('La/la prestation {string} est éligible/eligible',
     (prestation) => cy.isPrestationInStatus(prestation, PrestationStatus.ELIGIBLE)
);
Then('La/la prestation {string} est refusée/refusee/refuse',
     (prestation) => cy.isPrestationInStatus(prestation, PrestationStatus.REFUSEE,)
);
Then('La/la prestation {string} est déjà/deja perçue/percue',
     (prestation) => cy.isPrestationInStatus(prestation, PrestationStatus.PERCUE)
);
