import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { PrestationStatus } from "../../support/prestation-status";

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
