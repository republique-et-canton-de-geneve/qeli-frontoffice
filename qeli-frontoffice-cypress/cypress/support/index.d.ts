/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {

    /**
     * Récupère un élément depuis son attribut data-cy
     *
     * @param value Valeur de l'attribut data-cy
     *
     * @example cy.dataCy('0101_prestations')
     */
    dataCy(value: string): Chainable<any>

    /**
     * Récupère un élément depuis son attribut data-cy-label
     *
     * @param value Valeur de l'attribut data-cy-label
     * @example cy.dataCyLabel('0301_etatCivil')
     */
    dataCyLabel(value: string): Chainable<any>

    /**
     * Récupère un élément depuis son attribut data-cy-${eligibilite}=${prestation}
     *
     * @param eligibilite Suffixe de l'attribut data-cy-
     * @param prestation Valeur de l'attribut data-cy-*
     */
    getPrestationParEligibilite(eligibilite: string, prestation: string): Chainable<any>

    /**
     * Vérifie l'affichage du résultat d'une ou plusieurs prestations par état (éligible, perçue, refusée)
     *
     * @param statut Statut de l'éligibilitée, valeurs possibles : prestations-eligibles, prestations-refusees ou
     *   prestations-percues
     * @param prestation Prestation(s) testée(s)
     */
    checkStatutPrestation(statut: string, prestation: string): Chainable<any>

    /**
     * Clique sur le bouton suivant du formulaire
     */
    clickNext(): Chainable<any>

    /**
     * Clique sur le bouton précédent du formulaire
     */
    clickPrevious(): Chainable<any>

    /**
     * Connexion au formulaire sur l'url définie par la variable d'environnement 'baseUrl'
     */
    connectionFormulaire(): Chainable<any>

    /**
     * Réponds à une question de type nationalité du formulaire
     *
     * @param question couple 'code + key' de la question, exemple : "0101_prestations"
     * @param answer réponse à la question, peut être une liste de valeurs séparée par une virgule
     *
     * @example cy.answerQuestion('0401_nationalite', 'ch,be')
     */
    answerNationalite(question: string, answer: string): Chainable<any>


    /**
     * Réponds à une question du formulaire
     *
     * @param question Couple 'code + key' de la question, exemple : "0101_prestations"
     * @param answer Réponse à la question, peut être une liste de valeurs séparée par une virgule pour les checkbox
     * @param validate Valide ou non la question courante pour passer à la suivante (bouton suivant)
     *
     * @example cy.answerQuestion('0101_prestations', 'SUBSIDES', false)
     */
    answerQuestion(question: string, answer: string, validate: boolean): Chainable<any>

    /**
     * Réponds à une question du formulaire de type date à partir d'un âge.
     * La date testée sera "01.01.XXXX".
     *
     * @param question Couple 'code + key' de la question, exemple : "0201_dateNaissance"
     * @param years Réponse à la question en nombre d'années (l'âge)
     * @param validate Valide ou non la question courante pour passer à la suivante (bouton suivant)
     *
     * @example cy.answerQuestion('0201_dateNaissance', 30, false)
     */
    answerYearsQuestion(question: string, years: number, validate: boolean): Chainable<any>

  }
}
