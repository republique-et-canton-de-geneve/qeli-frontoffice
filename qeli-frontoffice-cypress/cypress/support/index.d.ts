/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Récupère un élément depuis son attribut data-cy.
     *
     * @param value Valeur de l'attribut data-cy.
     */
    dataCy(value: string): Chainable<any>

    /**
     * Remplis les données du demandeur.
     *
     * @param etatCivil L'état civil du demandeur.
     * @param age l'age du demandeur
     * @param prenom son prénom.
     */
    setDemandeur(etatCivil: string, age: number, prenom: string): Chainable<any>

    /**
     * Ajouter un membre dans le foyer du demandeur.
     *
     * @param relation la relation de ce membre avec le demandeur.
     * @param age l'age du nouveau membre.
     * @param prenom le prénom du nouveau membre.
     */
    addMembre(relation: string, age: number, prenom: string): Chainable<any>

    /**
     * Clique sur le bouton suivant du formulaire
     */
    clickNext(): Chainable<any>

    /**
     * Clique sur le bouton précédent du formulaire
     */
    clickPrevious(): Chainable<any>

    /**
     * Récupère un élément depuis son attribut <b>data-cy-question</b>
     *
     * @param questionKey la clé de la question, par exemple : "0101_prestations".
     *
     * @example cy.getQuestion('0101_prestations')
     */
    getQuestion(questionKey: string): Chainable<any>

    /**
     * Récupère un élément depuis son attribut data-cy-label
     *
     * @param questionKey Valeur de l'attribut data-cy-label
     *
     * @example cy.getQuestionLabel('0101_prestations').should('exist')
     */
    getQuestionLabel(questionKey: string): Chainable<any>

    /**
     * Réponds à une question du formulaire.
     *
     * @param questionKey Couple 'code + key' de la question, exemple : "0101_prestations".
     * @param answer Réponse à la question, peut être une liste de valeurs séparée par une virgule pour les checkbox.
     * @param submit si true passe à la question suivante en cliquant sur le bouton suivant. Par défaut c'est true.
     *
     * @example cy.answerQuestion('0101_prestations', 'SUBSIDES', false)
     * @example cy.answerQuestion('0501_dateArriveGeneve', '01.01.1970', true, 'demandeur')
     */
    answerQuestion(questionKey: string, answer: string, submit?: boolean): Chainable<any>

    /**
     * Réponds à une question de type nationalité du formulaire.
     *
     * @param questionKey couple 'code + key' de la question, exemple : "0401_nationalite"
     * @param answer réponse à la question, peut être une liste de valeurs séparée par une virgule
     *
     * @example cy.answerQuestion('0401_nationalite', 'ch,be')
     */
    answerNationalite(questionKey: string, answer: string): Chainable<any>

    /**
     * Réponds à une question du formulaire de type date à partir d'un âge.
     *
     * @param questionKey Couple 'code + key' de la question, exemple : "0501_dateArriveGeneve".
     * @param years Réponse à la question en nombre d'années (l'âge).
     * @param submit si true passe à la question suivante en cliquant sur le bouton suivant. Par défaut c'est true.
     *
     * @example cy.answerQuestion('0501_dateArriveGeneve', 30, false)
     * @example cy.answerQuestion('0501_dateArriveGeneve', 30, true, 'concubin')
     */
    answerYearsQuestion(questionKey: string, years: number, submit?: boolean): Chainable<any>

    /**
     * Vérifie l'affichage du résultat d'une ou plusieurs prestations par statut.
     *
     * @param prestation une ou plusieurs prestations à tester.
     * @param status Le statut d'éligibilité, valeurs possibles : prestations-eligibles, prestations-refusees ou
     *   prestations-percues.
     */
    isPrestationInStatus(prestation: string, status: string): Chainable<any>
  }
}
