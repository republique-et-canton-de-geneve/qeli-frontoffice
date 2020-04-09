# QELI Cypress : Tests d'intégration

Ce module a pour but d'exécuter des scenarii de tests **écrits par le métier**.
L'objectif est de simuler le remplissage du questionnaire de manière automatique et de
contrôler le résultat de chaque scénario.

Le dépôt dédié [qeli-scenarii-metier][qeli-scenarii-metier] regroupe les fichiers
(`.feature`) modifiables par les utilisateurs métiers.
Il est importé en tant que sous-module Git dans
[cypress/integration](./cypress/integration/).


## Structure

La configuration des outils suivants a été mise en place pour répondre à ce besoin :

* [Cypress][cypress-doc] est un framework JS Open Source permettant de
tester l'application web.
* [Cucumber][cucumber-doc] permet d'écrire et de coder des tests BDD (Behavior Driven
Development).
* [cypress-cucumber-preprocessor][cypress-cucumber-pp] intègre les tests Cucumber
(avec la syntaxe  [Gherkin][gherkin-doc]) à Cypress.


## Tests Cypress + Cucumber

Note: On utilise des [commandes personnalisées][cypress-custom-commands] définies
dans [cypress/support/commands.js](cypress/support/commands.js).

Les correspondances de phrases Cucumber sont définies dans
[cypress/integration/common](cypress/integration/common).

### vérifier

* l'affichage ou non des questions :

```js
cy.dataCyLabel('0101_prestations').should('be.visible')
cy.dataCyLabel('0101_prestations').should('not.be.visible')
```

* le libellé des questions :

```js
cy.dataCyLabel('0301_etatCivil').should('contain', 'Quel est votre état civil?');
```

* si une question est obligatoire ou non :

```js
cy.dataCyLabel('0301_etatCivil').find('span').should('have.class', 'form-required');
cy.dataCyLabel('0301_etatCivil').find('span').should('not.have.class', 'form-required');
```

* les réponses possibles aux questions :

```js
cy.get('#0301_etatCivil > option').eq(0).should('contain', 'Célibataire');
cy.get('#0301_etatCivil > option').eq(1).should('contain', 'Marié(e)');
```

* l'état d'un bouton :

```js
cy.get('[data-cy=previousQuestion]').should('be.disabled');
```

### interagir

* remplir un champ texte :

```js
cy.get('input[type=text]').type(answer);
```

* cocher une checkbox :

```js
cy.dataCy('0101_prestations').find('input[type=checkbox]').check();
```

* sélectionner la valeur d'une liste :

```js
cy.get('select').select(answer);
```

* cliquer sur un bouton :

```js
cy.get('[data-cy=nextQuestion]').click();
cy.clickNext();

cy.get('[data-cy=previousQuestion]').click();
cy.clickPrevious();
```

### manipuler des données avec un tableau

Cucumber offre la possibilité d'utiliser en entrée un type
[DataTable][cucumber-DataTable], par exemple :

```gherkin
  Quand je remplis mon adresse:
    | rue    | Rue des champs |
    | numero | 1              |
    | ville  | Genève         |
```

Mapping de la phrase :

```js
  When("je remplis mon adresse:", (dataTable) => {
    const obj = { rue: 'Rue des champs', numero: 1, ville: 'Genève' };
    let adresse = dataTable.rowsHash();
    cy.expect(obj).to.deep.equal(adresse);
  });
```


## Configuration

* `cypress.json` : configuration globale de Cypress.
* `cypress/config/cypress.default.json` : configuration par défaut.
* `cypress/config/cypress.dev.json` : configuration de l'environment de développement.
* `cypress/config/cypress.rec.json` : configuration de l'environment de recette.
* `cypress/config/cypress.prod.json` : configuration de l'environment de production.


## Exécution

Les tests d'intégration sont liés à la phase `integration-test` de Maven, il suffit
d'exécuter la commande suivante :

```bash
mvn clean verify
```

Une instance de [qeli-frontoffice-application](../qeli-frontoffice-application) sera
démarrée sur le port 8080.

Pour exécuter les tests sur une instance existante, utilisez `npm` directement :

Pour exécuter les tests en ligne de commande :

```bash
npm run cy:run
```

Le fichier `./config/cypress.local.json` est réservé pour personnaliser la
configuration et il sera ignoré par Git. Pour en créer un :

```bash
cp ./config/cypress.default.json ./config/cypress.local.json
```

et pour l'utiliser :

```bash
npm run cy:run -- --env qeli-env=local
```

### Ouvrir l'interface Cypress

La commande suivante permet de démarrer Cypress en mode graphique :

```bash
npm run cy:open
```

Il est possible de spécifier le fichier de configuration, si besoin, ainsi :

```bash
# Lancer les tests sur une instance locale
npm run cy:open -- --env qeli-env=local

# Lancer les tests sur l'instance de dev
npm run cy:open -- --env qeli-env=dev

# Lancer les tests sur l'instance de recette
npm run cy:open -- --env qeli-env=rec

# Lancer les tests sur l'instance de production
npm run cy:open -- --env qeli-env=prod
```

---

## Astuces

### Installation avec binaire

Il est possible que le script d'installation de Cypress échoue. Dans ce cas vous
pouvez l'installer manuellement en téléchargeant le binaire depuis
https://download.cypress.io/desktop
(rester patient devant l'éventuel écran blanc).

Ensuite il faut renseigner la variable d'environment `CYPRESS_INSTALL_BINARY` avant
de lancer l'installation :

```bash
export CYPRESS_INSTALL_BINARY=/home/$USER/Downloads/cypress.zip
npm install
```


[cypress-doc]: https://docs.cypress.io/
[cypress-custom-commands]: https://docs.cypress.io/api/cypress-api/custom-commands.html
[cypress-cucumber-pp]: https://www.npmjs.com/package/cypress-cucumber-preprocessor
[cucumber-doc]: https://cucumber.io/docs/cucumber/
[cucumber-DataTable]: https://github.com/cucumber/cucumber-js/blob/master/src/models/data_table.ts
[gherkin-doc]: https://cucumber.io/docs/gherkin/reference/
[qeli-scenarii-metier]: ***REMOVED***/DEVELOPPEUR-SOCIAL/10818-qeli/qeli-scenarii-metier
