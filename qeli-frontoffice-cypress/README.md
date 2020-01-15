# Module Cypress & Cucumber

Ce module a pour but d'exécuter des scenarii de tests **écrits par le métier**.

## Configuration

La configuration des outils suivants a été mise en place pour répondre à ce besoin :

* [Cypress][cypress-doc] est un framework JS Open Source permettant de
tester l'application web

* [Cucumber][cucumber-doc] permet d'écrire et coder des tests BDD (Behavior Driven
Development)

* [cypress-cucumber-preprocessor][cypress-cucumber-pp]
 intègre les tests Cucumber (avec la syntaxe Gherkin) à Cypress


## Structure

### Configuration

* `cypress.json` : configuration globale de Cypress
* `cypress/config/cypress.ci.json` : configuration dédiée au serveur CI
* `cypress/config/cypress.dev.json` : configuration de développement

### Tests pour les utilisateurs métiers

Un dépôt dédié importé en sous-module dans le projet regroupe les fichiers de
scenarii (`.feature`) : [qeli-scenarii-metier][qeli-scenarii-metier]

## Exemple de scénario




## Exécution

```bash
npm run cy:run
```


## CI

```bash
npm run cy:run --env configFile=ci
```


Jenkinsfile pour lancer les tests en ligne de commande via un pipeline (job) Jenkins
	* 1st time : cypress verify (pour tester la machine)
	* CACHE :
		restore cache (keys -package)
		cache ~./npm ~./cache


[cypress-doc]: https://docs.cypress.io/
[cucumber-doc]: https://cucumber.io/docs/cucumber/
[cypress-cucumber-pp]: https://www.npmjs.com/package/cypress-cucumber-preprocessor
[qeli-scenarii-metier]: ***REMOVED***/DEVELOPPEUR-SOCIAL/qeli-scenarii-metier
