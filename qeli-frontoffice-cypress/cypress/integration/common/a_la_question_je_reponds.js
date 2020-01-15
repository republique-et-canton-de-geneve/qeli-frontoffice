import {Then} from "cypress-cucumber-preprocessor/steps";

const TEXTBOX = 'input[type=text]';
const DATE = 'input[type=date]';
const CHECKBOX = 'input[type=checkbox]';
const SELECT = 'select';

Then(`A la question {string}, je réponds {string}`, (question, answer) => {
    console.log("-----------------------")
    console.log("Q:"+question)
    console.log("A:"+answer)

    cy.get('[data-cy=' + question + ']').then(($elem) => {

        if ($elem.find(CHECKBOX).length) {
            if (answer.indexOf(',') !== -1) { // handle array of string (multiple answers)
                answer.split(',').forEach(function (option) {
                    cy.get('[data-cy=' + option + ']').check()
                });
            } else {
                cy.get('[data-cy=' + answer + ']').check()
            }
        } else if ($elem[0].type === "select-one") {
            cy.get(SELECT).select(answer)
        } else if ($elem[0].type === "date") {
            cy.get(DATE).type(answer)
        } else if ($elem[0].type === "text") {
            cy.get(TEXTBOX).type(answer)
        } else {
            console.log("----OTHER TYPE")
            cy.wrap($elem).type(answer)
        }
        cy.get('[data-cy=nextQuestion]').click()
    })

})
