# QELI Cypress : Test d'intégration

Ce module a pour but d'exécuter des scenarii de tests **écrits par le métier**.

Le dépôt dédié [qeli-scenarii-metier][qeli-scenarii-metier] regroupe les fichiers
(`.feature`) modifiables par les utilisateurs métiers.
Il est importé en sous-module dans [cypress/integration/].


## Structure

La configuration des outils suivants a été mise en place pour répondre à ce besoin :

* [Cypress][cypress-doc] est un framework JS Open Source permettant de
tester l'application web.
* [Cucumber][cucumber-doc] permet d'écrire et coder des tests BDD (Behavior Driven
Development).
* [cypress-cucumber-preprocessor][cypress-cucumber-pp] intègre les tests Cucumber
(avec la syntaxe  [Gherkin][gherkin-doc]) à Cypress.


## Configuration

* `cypress.json` : configuration globale de Cypress.
* `cypress/config/cypress.default.json` : configuration par défaut.
* `cypress/config/cypress.dev.json` : configuration de l'environment de dev.
* `cypress/config/cypress.rec.json` : configuration de l'environment de recette.
* `cypress/config/cypress.prod.json` : configuration de l'environment de production.

## Exécution

Les tests d'intégration sont liés à la phase `integration-test` de Maven, il suffit
d'exécuter la commande suivante :

```bash
mvn clean verify
```

une instance de [qeli-frontoffice-application](../qeli-frontoffice-application) sera
démarrée sur le port 8080.

Pour exécuter les tests sur une instance existante utilisez `npm` directement :

Pour exécuter les tests en ligne de commande :

```bash
npm run cy:run
```

le fichier `./config/cypress.local.json` est réservé pour personnaliser la
configuration et il sera ignoré par git, pour en créer un :

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
# Lancer les tests sur une instance local
npm run cy:open -- --env qeli-env=local

# Lancer les tests sur l'instance de dev
npm run cy:open -- --env qeli-env=dev

# Lancer les tests sur l'instance de recette
npm run cy:open -- --env qeli-env=rec

# Lancer les tests sur l'instance de production
npm run cy:open -- --env qeli-env=prod
```


## Astuces

### Installation avec binaire

Il est possible que le script d'installation de Cypress échoue. Dans ce cas vous
pouvez l'installer manuellement en téléchargeant le binaire depuis :
https://www.cypress.io/

Ensuite il faut renseigner la variable d'environment `CYPRESS_INSTALL_BINARY` avant
de lancer l'installation :

```bash
export CYPRESS_INSTALL_BINARY=/home/$USER/Downloads/cypress.zip
npm install
```


[cypress-doc]: https://docs.cypress.io/
[cucumber-doc]: https://cucumber.io/docs/cucumber/
[cypress-cucumber-pp]: https://www.npmjs.com/package/cypress-cucumber-preprocessor
[qeli-scenarii-metier]: ***REMOVED***/DEVELOPPEUR-SOCIAL/10818-qeli/qeli-scenarii-metier
[gherkin-doc]: https://cucumber.io/docs/gherkin/reference/
