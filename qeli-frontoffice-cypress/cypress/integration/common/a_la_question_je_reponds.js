import { When } from 'cypress-cucumber-preprocessor/steps';

When('A/a/à la question {string}(,) je réponds/coche {string} sans validation',
     (question, answer) => cy.answerQuestion(question, answer, false));

When('A/a/à la question {string}(,) je réponds/coche {string}',
     (question, answer) => cy.answerQuestion(question, answer, true));

When('A/a/à la question {string}(,) je réponds/coche {string}(,) (et) {string}',
     (question, answerNone, answer) => {
       cy.answerQuestion(question, 'NONE', false);
       cy.answerQuestion('noneDetail', answer, true);
     }
);

When('A/a/à la question {string}(,) je réponds/coche {string}(,) (et) {string} sans validation',
     (question, answerNone, answer) => {
       cy.answerQuestion(question, 'NONE', false);
       cy.answerQuestion('noneDetail', answer, false);
     }
);
