import { Then } from "cypress-cucumber-preprocessor/steps";
/*
Then(`Je vois la prestation {string} {string} eligible`, (codePrestation, ouiNon) => {
    console.log(codePrestation + " " + ouiNon + " eligible")
    cy.pause()
})*/
Then(`Je vois la prestation eligible`, () => {
    console.log("OK eligible")
})
