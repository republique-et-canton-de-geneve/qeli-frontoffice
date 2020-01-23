import { When } from "cypress-cucumber-preprocessor/steps";

When(`A la question {string}, je réponds {string}`,
     (question, answer) => cy.answerQuestion(question, answer, true));
