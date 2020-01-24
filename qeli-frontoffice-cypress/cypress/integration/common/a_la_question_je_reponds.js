import { When } from "cypress-cucumber-preprocessor/steps";

When(`A/a/à la question {string}(,) je réponds/coche {string}`,
     (question, answer) => cy.answerQuestion(question, answer, true));
