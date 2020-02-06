import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

const neatCSV = require('neat-csv');

let donnees;
let scenarios = [];

Given("j'utilise le jeu de données {string}", (fichier) => {
  cy.readFile('cypress/integration/features-metier/' + fichier)
    .then(neatCSV) // converts text into list of objects
    /* eslint-disable-next-line no-console */
    .then(console.table) // convenient method for printing list of objects in DevTools console
    .then((records) => {
      donnees = records;
      for (const [scenario] of Object.entries(donnees[0])) {
        if (scenario !== "question") {
          scenarios.push(scenario);
        }
      }
    });
});

Then('je contrôle mes scenarii sur le formulaire', () => {
  scenarios.forEach((scenario) => {
    cy.connectionFormulaire();

    donnees.forEach((row) => {
      let valeur = row[scenario];
      let clef = row["question"];

      if (valeur && valeur.trim() !== '') {
        switch (clef) {
          case Cypress.env('PRESTATIONS_ELIGIBLES'):
            cy.isPrestationEligible(valeur);
            break;
          case Cypress.env('PRESTATIONS_REFUSEES'):
            cy.isPrestationRefusee(valeur);
            break;
          case Cypress.env('PRESTATIONS_PERCUES'):
            cy.isPrestationPercue(valeur);
            break;
          default:
            cy.answerQuestion(clef, valeur, true);
            break;
        }
      }
    });
  });
});
