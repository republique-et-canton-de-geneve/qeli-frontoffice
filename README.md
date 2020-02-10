# Frontoffice du questionnaire d'eligibilité (QELI)

- [Liste de modules](#liste-de-modules)
- [Construction](#construction)
- [Démarrage](#dmarrage)
- [Livraison](#livraison)
- [Astuces](#astuces)

# Liste de modules

- [qeli-frontoffice-application](qeli-frontoffice-application) : Ce module se charge
de la construction et livraison du front office pour le deployment.
- [qeli-frontoffice-cypress](qeli-frontoffice-cypress) : Module pour la configuration
des scenarii de tests d'intégration de l'application.
- [qeli-frontoffice-ihm](qeli-frontoffice-ihm) : L'IHM du front office destiné aux
gestionnaires.
- [qeli-frontoffice-rest](qeli-frontoffice-rest) : Les services REST.
- [qeli-frontoffice-service](qeli-frontoffice-service) : Implémentation de la couche
métier du front office.
- [qeli-frontoffice-service-api](qeli-frontoffice-service-api) : Interface de la couche
métier du front office.

# Construction

## Pré-requis

- JDK 8
- Maven
- Node

## Comment construire

Récupérer la dernière version du sous-module des scenarii de test Cypress :

```bash
git submodule update --init
```

Build :

```bash
mvn clean install
```

Un rapport jacoco est généré pour chacun de modules, le rapport se trouve sous
le dossier: `./target/site/jacoco/` de chaque module.

**ATTENTION**: Le module `qeli-frontoffice-ihm` ne fournie pas de rapport de test
jacoco.

# Démarrage

Pour démarrer l'application exécuter la commande suivante :

```bash
cd qeli-frontoffice-application
mvn spring-boot:run -Pdevelopment
```

#### Rest API

Le REST API sera disponible sur: http://localhost:8080/socialqeli_pub/api/

#### IHM

L'IHM sera disponible sur: http://localhost:8080/socialqeli_pub/formulaire/

#### Frontend

Pour démarrer uniquement le frontend en local veuillez exécuter la commande suivante:

```bash
cd qeli-frontoffice-ihm
npm run start
```

L'application web application sera disponible sur :
[http://localhost:4200](http://localhost:4200).

# Livraison

La stratégie de branching de l'application est git flow.

Pour livrer une nouvelle version il suffit de suivre le workflow release. Un plugin
maven a été rajouté pour faciliter cette tâche.

- Pour créer une branch de release exécuter la commande suivante :

```bash
mvn gitflow:release-start
```

- Une fois le code est stable on peut figer un tag et publier la nouvelle version
en exécutant la commande suivante :

```bash
mvn gitflow:release-finish
```

- Il est aussi possible de faire une release d'un coup (sans création de release
branch) en exécutant la commande suivante :

 ```bash
mvn gitflow:release
```

Pour le mode non-interactive il faut rajouter l'argument `-B`,  si le paramètre
`releaseVersion` n'est pas défini, la version par défaut sera utilisée :

 ```bash
mvn -B gitflow:release
```

## Livrable standalone (Windows)

Pour construire un livrable windows veuillez exécuter la commande suivante :

```bash
mvn clean package -Pstandalone
```

Avec un proxy il faut éxecuter cette commande ainsi :

```bash
export JVM_PROXY_FLAGS="-Dhttp.proxyHost=$HTTP_PROXY_HOST  \
                        -Dhttp.proxyPort=$HTTP_PROXY_PORT  \
                        -Dhttps.proxyHost=$HTTP_PROXY_HOST \
                        -Dhttps.proxyPort=$HTTP_PROXY_PORT"

mvn clean package -Pstandalone $JVM_PROXY_FLAGS
```

Un livrable windows en format `ZIP` sera disponible sur :
`qeli-frontoffice-application/target/qeli-frontoffice-application-windows.zip`.

Décompresser le fichier et double click sur le fichier
`qeli-frontoffice-application.cmd` pour démarrer le server en mode standalone.

L'IHM est disponible sur: http://localhost:8080/socialqeli_pub/frontoffice

Pour arrêter le server fermer la fenêtre du terminal.


## Références

- Gitflow cheatsheet : https://danielkummer.github.io/git-flow-cheatsheet/
- Gitflow maven plugin : https://github.com/aleksandr-m/gitflow-maven-plugin

## Astuces

### Références de la charte graphique

- https://outil.ge.ch/site/charte-internet/
- https://outil.ge.ch/site/charte-internet/version/2.4/

### Sauter les tests

L'argument `skipTests` désactive tous les tests pendant la compilation :

```bash
mvn clean install -DskipTests=true
```

Il est aussi possible de désactiver les tests Java, IHM et Cypress individuellement :

* `ihm.test.skip` : désactive les tests IHM, e.g. :
`mvn clean install -Dihm.test.skip=true`
* `cypress.test.skip` : désactive les tests d'intégration Cypress, e.g. :
`mvn clean install -Dihm.test.skip=true`
* `surefire.test.skip` : désactive les Java, e.g. :
`mvn clean install -Dihm.test.skip=true`

### Sauter la compilation de l'IHM

Il est possible de construire l'application en sautant la compilation de l'IHM,
pour cela éxecuter la commande suivante :

```bash
# Sauter la compilation de l'ihm
mvn clean install -pl '!qeli-frontoffice-ihm'

# Sauter la compilation des tests d'intégration
mvn clean install -pl '!qeli-frontoffice-cypress'

# Sauter la compilation de l'ihm et des tests d'intégration
mvn clean install -pl '!qeli-frontoffice-ihm,!qeli-frontoffice-cypress'
```

### Style du code

Le style du code est défini par le fichier [.editorconfig](.editorconfig) à la racine
du projet.

Pour certains IDE il faudra installer un plugin qui permettra son intégration.

L'information sur le format, les IDE et plugins compatible se trouve ici :
https://editorconfig.org

### Configuration de Node

Remplir le fichier `~/.npmrc` avec la configuration suivante :

```bash
cafile=/path/to/ge-app.pem
http-proxy=http://localhost:3128
https-proxy=http://localhost:3128
proxy=http://localhost:3128
strict-ssl=false
registry=***REMOVED***/content/repositories/npmjs/
 ```

### Problèmes avec node-sass

En cas de problème avec node-sass, exécuter la commande suivante
`npm rebuild node-sass`.

Cette commande est intégrée dans une phase Maven du module qeli-frontoffice-ihm.
