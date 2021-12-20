# language: fr
Fonctionnalité: Divorcés
  Cas de test des demandeurs divorcés

  Scénario: 36 - divorcé, avec concubin, avec enfant du concubin (13 ans en formation) et un en commun (10 ans en formation) , école primaire, école primaire, Subsides, alloc, tous suisses, à Genève depuis naissance, 1 travaille 50%, 1 AI avec rente Locataire 5 pièces, assurance maladie LaMAL, pension pour l'enfant du concubin pas payé, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "DIVORCE", j'ai 46 ans et je m'appelle "Guy"
    Et que j'ai un "CONCUBIN", qui a 47 ans et il s'appelle "Chantal"
    Et que j'ai un "ENFANT", qui a 13 ans et il s'appelle "Rémy"
    Et que j'ai un "ENFANT", qui a 10 ans et il s'appelle "Valentin"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Rémy", je réponds "AUTRE_PARENT"
    Et à la question "0506_parentsEnfants_Valentin", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "SUBSIDES_Guy, SUBSIDES_Chantal, SUBSIDES_Rémy, SUBSIDES_Valentin, ALLOCATION_LOGEMENT"
    Et à la question "0702_formation_Guy", je réponds "NON" sans validation
    Et à la question "0702_formation_Chantal", je réponds "NON" sans validation
    Et à la question "0702_formation_Rémy", je réponds "OUI" sans validation
    Et à la question "0702_formation_Valentin", je réponds "OUI"
    Et à la question "0701_scolarite_Rémy", je réponds "SCOLARITE_OBLIGATOIRE_1P_A_10P"
    Et à la question "0701_scolarite_Valentin", je réponds "SCOLARITE_OBLIGATOIRE_1P_A_10P"
    Et à la question "0401_nationalite_Guy", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Chantal", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Rémy", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Valentin", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Guy", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Guy", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Chantal", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Chantal", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Guy", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Guy", je réponds "NON"
    Et à la question "0601_revenus_Chantal", je réponds "AI_INVALIDITE"
    Et à la question "0601_revenus_Rémy", je réponds "NON"
    Et à la question "0601_revenus_Valentin", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Guy", je réponds "100"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est déjà perçue
    Alors la prestation "PC_FAM" est éligible
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES" est refusée
