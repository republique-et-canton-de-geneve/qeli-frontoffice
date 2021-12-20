# qeli-scenarii-metier

Ce dépôt regroupe les fichiers de scenarii pour les tests écrits par les utilisateurs
 métiers

## Documentation

Les mots clefs suivants sont disponibles dans la définition des tests. Chaque mot
-clef traduit de l'anglais possède des [équivalents][Gherkin-traduction-fr].

| Mot-clef | Description
| --- | ---
| Fonctionnalité (Feature) | Description globale d'un ensemble de tests
| Scénario | C'est l'exemple concret qui illustre une règle métier, composée de plusieurs étapes
| Etant donné que (Given) | Etape qui décrit le contexte initial du scénario
| Quand (When) | Etape qui décrit un évènement, action spécifique d'un utilisateur
| Alors (Then) | Etape qui décrit le résultat attendu
| Et, Mais (And, But) | continue n'importe quel des 3 opérateurs précédents
| Contexte (Background) | Permet de définir un contexte exécuté avant chaque scénario
| Plan du scénario (Scenario Outline) | Permet d'exécuter un scénario plusieurs fois avec différentes valeurs
| Exemples (Examples) | Fournit les jeux de données pour le plan de scénario

## Exemples

### Scénario d'éligibilité

```gherkin
# language: fr
Fonctionnalité: Eligibilité : Subsides d'assurance maladie
  On teste l'éligibilité au subsides d'assurance maladie.

  Scénario: Les éligibilités sont déjà perçues si on les coches
    Etant donné que Je suis sur le formulaire
    Et que Je suis "CELIBATAIRE", j'ai 18 ans et je m'appelle "Jaime"
    Quand Je passe à la question suivante
    Et  A la question "0101_prestations", je coche "SUBSIDES_Jaime,AVANCES,ALLOCATION_LOGEMENT,SUBVENTION_HM,BOURSES_Jaime,PC_AVS_AI,PC_FAM,AIDE_SOCIALE"
    Alors La prestation "SUBSIDES" est déjà perçue
```

### Contrôle du libellé d'une question

```gherkin
  Alors je vois la question "0101_question" "Quelle heure est-il?"
```

### Vérification d'un message d'erreur

```gherkin
  Quand A la question "0201_dateNaissance", je réponds "2321-01-12"
  Alors un message d'erreur "Date de naissance incorrecte" s'affiche
```

[Gherkin-traduction-fr]: https://cucumber.io/docs/gherkin/reference/#gherkin-dialect-fr-content
