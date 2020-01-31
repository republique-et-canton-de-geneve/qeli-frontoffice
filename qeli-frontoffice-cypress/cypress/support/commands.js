const TEXTBOX = 'input[type=text]';
const RADIO = 'input[type=radio]';
const CHECKBOX = 'input[type=checkbox]';
const DATE = 'input[type=date]';
const SELECT = 'select';

/**
 * Récupère un élément depuis son attribut data-cy
 */
Cypress.Commands.add('dataCy', (value) => cy.get(`[data-cy=${value}]`));

/**
 * Récupère un élément depuis son attribut data-cy-label
 */
Cypress.Commands.add('dataCyLabel', (value) => cy.get(`[data-cy-label=${value}]`));

/**
 * Clique sur le bouton suivant du formulaire
 */
Cypress.Commands.add('clickNext', () => cy.get('[data-cy=nextQuestion]').should('not.be.disabled').click());

/**
 * Clique sur le bouton précédent du formulaire
 */
Cypress.Commands.add('clickPrevious', () => cy.get('[data-cy=clickPrevious]').click());

/**
 * Réponds à une question de type nationalité du formulaire
 *
 * @param question couple 'code + key' de la question, exemple : "0101_prestations"
 * @param answer réponse à la question, peut être une liste de valeurs séparée par une virgule
 */
Cypress.Commands.add('answerNationalite', (question, answer) => {
  if (answer.indexOf(',') !== -1) {
    const nationalites = answer.split(',');
    nationalites.forEach((nationalite, i) => {
      cy.get(`[data-cy=${question}_select_nationalite_${i}]`).select(nationalite);
      if (i < nationalites.length - 1) {
        cy.get(`[data-cy=${question}_ajouter_nationalite_${i}]`).should('not.be.disabled').click();
      }
    });
  } else if (answer === 'apatride') {
    cy.get(`[data-cy=${question}_checkbox_apatride]`).check();
  } else {
    cy.get(`[data-cy=${question}_select_nationalite_0]`).select(answer);
  }
});

/**
 * Réponds à une question du formulaire
 *
 * @param question couple 'code + key' de la question, exemple : "0101_prestations"
 * @param answer réponse à la question, peut être une liste de valeurs séparée par une virgule pour les checkbox
 * @param validate valide ou non la question courante pour passer à la suivante (bouton suivant)
 */
Cypress.Commands.add('answerQuestion', (question, answer, validate) => {

  cy.dataCy(question).then(($elem) => {
    if (answer.trim().length > 0) {
      if ($elem[0].getAttribute('data-cy-type') === 'nationalite') {
        cy.answerNationalite(question, answer);
      } else if ($elem.find(CHECKBOX).length) {
        if (answer.indexOf(',') !== -1) { // handle array of string (multiple answers)
          answer.split(',').forEach((option) => cy.get('[data-cy=' + option + ']').check());
        } else {
          cy.dataCy(answer).check();
        }
      } else if ($elem.find(RADIO).length) {
        cy.dataCy(answer).check();
      } else if ($elem[0].type === 'select-one') {
        cy.get(SELECT).select(answer);
      } else if ($elem[0].type === 'date') {
        cy.get(DATE).type(answer);
      } else if ($elem[0].type === 'text') {
        cy.get(TEXTBOX).type(answer);
      } else {
        cy.wrap($elem).type(answer);
      }
    }

    if (validate) {
      cy.clickNext();
    }

  });
});