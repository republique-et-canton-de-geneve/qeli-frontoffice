# Module Cypress & Cucumber

Ce module a pour but d'exécuter des scenarii de tests **écrits par le métier**.

## Configuration

La configuration des outils suivants a été mise en place pour répondre à ce besoin :

* [Cypress][cypress-doc] est un framework JS Open Source permettant de
tester l'application web

* [Cucumber][cucumber-doc] permet d'écrire et coder des tests BDD (Behavior Driven
Development)

* [cypress-cucumber-preprocessor][cypress-cucumber-pp]
 intègre les tests Cucumber (avec la syntaxe [Gherkin][gherkin-doc]) à Cypress


## Structure

### Configuration

* `cypress.json` : configuration globale de Cypress
* `cypress/config/cypress.dev.json` : configuration de développement (par défaut)
* `cypress/config/cypress.ci.json` : configuration dédiée au serveur CI
* `cypress/config/cypress.rec.json` : configuration dédiée au serveur REC
* `cypress/config/cypress.prod.json` : configuration dédiée au serveur PROD

### Tests pour les utilisateurs métiers

Un dépôt dédié importé en sous-module dans le projet regroupe les fichiers de
scenarii (`.feature`) : [qeli-scenarii-metier][qeli-scenarii-metier]

## Exemple de scénario

Voir le [README.md](features-metier/README.md) du sous-module.


## Exécution

Pour exécuter les tests en ligne de commande :

```bash
npm run cy:run
```

Avec l'interface graphique Cypress :

```bash
npm run cy:open
```

## CI

```bash
npm run cy:run:ci
```


[cypress-doc]: https://docs.cypress.io/
[cucumber-doc]: https://cucumber.io/docs/cucumber/
[cypress-cucumber-pp]: https://www.npmjs.com/package/cypress-cucumber-preprocessor
[qeli-scenarii-metier]: ***REMOVED***/DEVELOPPEUR-SOCIAL/qeli-scenarii-metier
[gherkin-doc]: https://cucumber.io/docs/gherkin/reference/
