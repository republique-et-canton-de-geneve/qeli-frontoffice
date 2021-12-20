# language: fr
Fonctionnalité: Céibataire avec enfant(s)
  On teste les cas de célibataire avec enfant(s)

  Scénario: 38 - Célibataire avec enfant, Aide sociale, Autre pays, à Genève depuis 4 ans, Sans travail (pas droit au chômage), Locataire 4 pièces, assurance maladie LaMAL, pension alimentaire non payée, Taxé d'office, pas de fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 41 ans et je m'appelle "Emmeline"
    Et que j'ai un "ENFANT", qui a 17 ans et il s'appelle "Ruben"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Ruben", je réponds "MOI"
    Et à la question "0101_prestations", je coche "AIDE_SOCIALE"
    Et à la question "0702_formation_Emmeline", je réponds "NON" sans validation
    Et à la question "0702_formation_Ruben", je réponds "OUI"
    Et à la question "0701_scolarite_Ruben", je réponds "CLASSE_PREPARATOIRE"
    Et à la question "0401_nationalite_Emmeline", je réponds "af" sans validation
    Et à la question "0401_nationalite_Ruben", je réponds "af"
    Et à la question "0407_typePermis_Emmeline", je réponds "B" sans validation
    Et à la question "0408_complementPermisB_Emmeline", je réponds "REFUGIE" sans validation
    Et à la question "0409_dateArriveeSuisse_Emmeline", je réponds "04.12.2016"
    # Et à la question "0409_dateArriveeSuisse_Emmeline", je réponds 4 ans
    Et à la question "0407_typePermis_Ruben", je réponds "B" sans validation
    Et à la question "0408_complementPermisB_Ruben", je réponds "REFUGIE" sans validation
    Et à la question "0409_dateArriveeSuisse_Ruben", je réponds "04.12.2016"
    # Et à la question "0409_dateArriveeSuisse_Ruben", je réponds 4 ans
    Et à la question "0501_domicileCantonGE_Emmeline", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Emmeline", je réponds "12.01.2016"
    # Et à la question "0502_dateArriveeGeneve_Emmeline", je réponds 4 ans
    Et à la question "0601_revenus_Emmeline", je réponds "INCONNU" sans validation
    Et à la question "0602_situationRente_Emmeline", je réponds "NON"
    Et à la question "0601_revenus_Ruben", je réponds "INCONNU" sans validation
    Et à la question "0602_situationRente_Ruben", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "4"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1201_droitPensionAlimentaire", je réponds "OUI"
    Et à la question "1202_recoisEntierementPensionAlimentaire", je réponds "NON"
    Et à la question "1301_impotFortune", je réponds "NON"
    Alors la prestation "SUBSIDES" est refusée
    Alors la prestation "AVANCES" est éligible
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est déjà perçue
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Emmeline" est refusée
    Alors la prestation "BOURSES_Ruben" est éligible
