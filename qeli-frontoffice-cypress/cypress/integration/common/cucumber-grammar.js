import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { StatutPrestation } from "./statut-prestation";

const url = Cypress.config('baseUrl');

// Given statements

Given('Je/je suis sur le formulaire', () => cy.visit(url));

// When statements
When('A/a/à la question {string}(,) je réponds/coche {string}',
     (question, answer) => cy.answerQuestion(question, answer, true));

When('A/a/à la question {string}(,) je réponds/coche {string} sans validation',
     (question, answer) => cy.answerQuestion(question, answer, false));

When('A/a/à la question {string}(,) je remplis:', (question, dataTable) => {
  const answers = dataTable.raw();

  answers.forEach((answer, index) => {
    const isLast = index === answers.length - 1;
    cy.answerQuestion(answer[0], answer[1], isLast);
  });
});

// Then statements
Then('Je/je vois la question {string} {string}',
     (question, title) => cy.dataCyLabel(question).should('contain', title)
);

// TODO c'est la même chose que la précedent mais avec moins de validation.
Then('La/la question {string} est posée',
     (question) => cy.dataCyLabel(question).should('be.visible')
);

// TODO C'est trop dangereux, la question peut ne pas arrivé à cause d'un bug (e.g. une nouvelle question arriven avant)
//  ce statement serait toujours valide.
Then('La/la question {string} (n\')est pas posée',
     (question) => cy.dataCyLabel(question).should('not.be.visible'));

Then('Un/un message d\'erreur {string} s\'affiche',
     (message) => cy.dataCyLabel('validation_message').should('contain', message)
);

Then('La/la prestation {string} est éligible/eligible',
     (prestation) => cy.checkStatutPrestation(StatutPrestation.ELIGIBLE, prestation));

Then('La/la prestation {string} est réfusée/refusee/refuse',
     (prestation) => cy.checkStatutPrestation(StatutPrestation.REFUSEE, prestation));

Then('La/la prestation {string} est déjà/deja perçue/percue',
     (prestation) => cy.checkStatutPrestation(StatutPrestation.PERCUE, prestation));
