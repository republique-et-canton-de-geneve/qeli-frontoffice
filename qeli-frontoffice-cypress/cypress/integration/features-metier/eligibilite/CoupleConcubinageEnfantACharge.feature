# language: fr
Fonctionnalité: Couple en cucubinage avec des enfants à charge
  On teste les couples en concubinage avec des enfants à charge

  Scénario: 16 - célibataire, avec un concubin, avec un enfant propre 16 ans en formation et un en commun 6 ans, collège, école primaire, Subsides, tous suisses, à Genève depuis naissance, 2 travaillent 100%, Locataire 7 pièces, assurance maladie LaMAL, pension non payée pour l'enfant propre, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 36 ans et je m'appelle "Jennifer"
    Et que j'ai un "CONCUBIN", qui a 37 ans et il s'appelle "Hubert"
    Et que j'ai un "ENFANT", qui a 16 ans et il s'appelle "Cyrielle"
    Et que j'ai un "ENFANT", qui a 6 ans et il s'appelle "Victor"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Cyrielle", je réponds "MOI"
    Et à la question "0506_parentsEnfants_Victor", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "SUBSIDES_Jennifer, SUBSIDES_Hubert, SUBSIDES_Cyrielle, SUBSIDES_Victor"
    Et à la question "0702_formation_Jennifer", je réponds "NON" sans validation
    Et à la question "0702_formation_Hubert", je réponds "NON" sans validation
    Et à la question "0702_formation_Cyrielle", je réponds "OUI"
    Et à la question "0702_formation_Victor", je réponds "OUI"
    Et à la question "0701_scolarite_Cyrielle", je réponds "COLLEGE_APRENTISSAGE"
    Et à la question "0701_scolarite_Victor", je réponds "SCOLARITE_OBLIGATOIRE_1P_A_10P"
    Et à la question "0401_nationalite_Jennifer", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Hubert", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Cyrielle", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Victor", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Jennifer", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Jennifer", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Hubert", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Hubert", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Jennifer", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Jennifer", je réponds "NON"
    Et à la question "0601_revenus_Hubert", je réponds "EMPLOI"
    Et à la question "0601_revenus_Cyrielle", je réponds "NON"
    Et à la question "0601_revenus_Victor", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Jennifer", je réponds "100"
    Et à la question "0902_tauxActivite_Hubert", je réponds "100"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "7"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Jennifer", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Hubert", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Cyrielle", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Victor", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_FAM" est éligible
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Jennifer" est refusée
    Alors la prestation "BOURSES_Hubert" est refusée
    Alors la prestation "BOURSES_Victor" est refusée
    Alors la prestation "BOURSES_Cyrielle" est éligible

  Scénario: 20 - célibataire, avec un concubin, avec enfant en commun 13 ans en formation et un du concubin 19 ans en formation, école primaire, bachelor universitaire, tous suisses, à Genève depuis naissance, 2 chômage 100% ,Locataire 6.5 pièces, assurance maladie LaMAL, pension de l'enfant du concubin pas payée,
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 36 ans et je m'appelle "Guy"
    Et que j'ai un "CONCUBIN", qui a 37 ans et il s'appelle "Chantal"
    Et que j'ai un "ENFANT", qui a 19 ans et il s'appelle "Rémy"
    Et que j'ai un "ENFANT", qui a 13 ans et il s'appelle "Valentin"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Rémy", je réponds "AUTRE_PARENT"
    Et à la question "0506_parentsEnfants_Valentin", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Guy", je réponds "NON" sans validation
    Et à la question "0702_formation_Chantal", je réponds "NON" sans validation
    Et à la question "0702_formation_Rémy", je réponds "OUI"
    Et à la question "0702_formation_Valentin", je réponds "OUI"
    Et à la question "0701_scolarite_Rémy", je réponds "COLLEGE_APRENTISSAGE"
    Et à la question "0701_scolarite_Valentin", je réponds "SCOLARITE_OBLIGATOIRE_1P_A_10P"
    Et à la question "0401_nationalite_Guy", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Chantal", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Rémy", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Valentin", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Guy", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Guy", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Chantal", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Chantal", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Guy", je réponds "CHOMAGE" sans validation
    Et à la question "0602_situationRente_Guy", je réponds "NON"
    Et à la question "0601_revenus_Chantal", je réponds "CHOMAGE"
    Et à la question "0601_revenus_Rémy", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Rémy", je réponds "NON"
    Et à la question "0601_revenus_Valentin", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Valentin", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0903_tauxActiviteDernierEmploi_Guy", je réponds "100"
    Et à la question "0903_tauxActiviteDernierEmploi_Chantal", je réponds "100"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "6"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1101_assuranceMaladieSuisse_Guy", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Chantal", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Rémy", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Valentin", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Guy", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Chantal", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Rémy", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Valentin", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est éligible
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Guy" est refusée
    Alors la prestation "BOURSES_Chantal" est refusée
    Alors la prestation "BOURSES_Valentin" est refusée
    Alors la prestation "BOURSES_Rémy" est éligible

  Scénario: 21 -  Célibataire, avec concubin et enfant en commun 10 ans en formation, école primaire, tous suisses, à Genève depuis naissance, 2 travaillent 80%, Locataire 5 pièces, assurance maladie LaMAL pour un des deux, l'autre pas d'assurance, Taxation classique, concubin taxé d'office
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 44 ans et je m'appelle "Mélanie"
    Et que j'ai un "CONCUBIN", qui a 44 ans et il s'appelle "Nicolas"
    Et que j'ai un "ENFANT", qui a 10 ans et il s'appelle "Bahia"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Bahia", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Mélanie", je réponds "NON" sans validation
    Et à la question "0702_formation_Nicolas", je réponds "NON" sans validation
    Et à la question "0702_formation_Bahia", je réponds "OUI"
    Et à la question "0701_scolarite_Bahia", je réponds "SCOLARITE_OBLIGATOIRE_1P_A_10P"
    Et à la question "0401_nationalite_Mélanie", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Nicolas", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Bahia", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Mélanie", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Mélanie", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Nicolas", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Nicolas", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Mélanie", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Mélanie", je réponds "NON"
    Et à la question "0601_revenus_Nicolas", je réponds "EMPLOI"
    Et à la question "0601_revenus_Bahia", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "OUI"
    Et à la question "0902_tauxActivite_Mélanie", je réponds "10"
    Et à la question "0902_tauxActivite_Nicolas", je réponds "10"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1101_assuranceMaladieSuisse_Mélanie", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Nicolas", je réponds "NON" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Bahia", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES" est refusée

  Scénario: 18 -  célibataire, avec un concubin, avec enfant en commun 15 ans, école primaire (11P), Subsides, tous suisses, à Genève depuis naissance, 2 travaillent 40%, Locataire 5 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 44 ans et je m'appelle "Capucine"
    Et que j'ai un "CONCUBIN", qui a 44 ans et il s'appelle "Guillaume"
    Et que j'ai un "ENFANT", qui a 15 ans et il s'appelle "Selma"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Selma", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "SUBSIDES_Capucine, SUBSIDES_Guillaume, SUBSIDES_Selma"
    Et à la question "0702_formation_Capucine", je réponds "NON" sans validation
    Et à la question "0702_formation_Guillaume", je réponds "NON" sans validation
    Et à la question "0702_formation_Selma", je réponds "OUI"
    Et à la question "0701_scolarite_Selma", je réponds "SCOLARITE_OBLIGATOIRE_11P"
    Et à la question "0401_nationalite_Capucine", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Guillaume", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Selma", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Capucine", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Capucine", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Guillaume", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Guillaume", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Capucine", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Capucine", je réponds "NON"
    Et à la question "0601_revenus_Guillaume", je réponds "EMPLOI"
    Et à la question "0601_revenus_Selma", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Capucine", je réponds "40"
    Et à la question "0902_tauxActivite_Guillaume", je réponds "40"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES" est refusée

  Scénario: 17 - célibataire, avec un concubin, avec un enfant propre chacun (22 ans en emploi et 18 ans en formation - enfant du concubin) et un en commun 11 ans, école de commerce, école primaire, Subsides, Alloc, Français, permis C, habitant à Genève depuis 13 ans, concubin autre pays à Genève depuis naissance, 2 travaillent 50%, Locataire 6 pièces , assurance maladie LaMAL, pension non payée pour l'enfant du concubin (18 ans), Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 46 ans et je m'appelle "Marion"
    Et que j'ai un "CONCUBIN", qui a 48 ans et il s'appelle "Josep"
    Et que j'ai un "ENFANT", qui a 22 ans et il s'appelle "Léon"
    Et que j'ai un "ENFANT", qui a 18 ans et il s'appelle "Antoine"
    Et que j'ai un "ENFANT", qui a 11 ans et il s'appelle "Noémie"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Léon", je réponds "MOI"
    Et à la question "0506_parentsEnfants_Antoine", je réponds "AUTRE_PARENT"
    Et à la question "0506_parentsEnfants_Noémie", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "SUBSIDES_Marion, SUBSIDES_Josep, SUBSIDES_Léon, SUBSIDES_Antoine, SUBSIDES_Noémie, ALLOCATION_LOGEMENT"
    Et à la question "0702_formation_Marion", je réponds "NON" sans validation
    Et à la question "0702_formation_Josep", je réponds "NON" sans validation
    Et à la question "0702_formation_Léon", je réponds "NON" sans validation
    Et à la question "0702_formation_Antoine", je réponds "OUI" sans validation
    Et à la question "0702_formation_Noémie", je réponds "OUI"
    Et à la question "0701_scolarite_Antoine", je réponds "CLASSE_PREPARATOIRE"
    Et à la question "0701_scolarite_Noémie", je réponds "SCOLARITE_OBLIGATOIRE_11P"
    Et à la question "0401_nationalite_Marion", je réponds "fr" sans validation
    Et à la question "0401_nationalite_Josep", je réponds "fr" sans validation
    Et à la question "0401_nationalite_Léon", je réponds "fr" sans validation
    Et à la question "0401_nationalite_Antoine", je réponds "fr" sans validation
    Et à la question "0401_nationalite_Noémie", je réponds "fr"
    Et à la question "0407_typePermis_Marion", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Marion", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Marion", je réponds "04.12.2007"
    # Et à la question "0409_dateArriveeSuisse_Marion", je réponds 13 ans
    Et à la question "0407_typePermis_Léon", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Léon", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Léon", je réponds "04.12.2007"
    # Et à la question "0409_dateArriveeSuisse_Léon", je réponds 13 ans
    Et à la question "0407_typePermis_Antoine", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Antoine", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Antoine", je réponds "04.12.2007"
    # Et à la question "0409_dateArriveeSuisse_Antoine", je réponds 13 ans 
    Et à la question "0407_typePermis_Noémie", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Noémie", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Noémie", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Marion", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Marion", je réponds "04.12.2007"
    # Et à la question "0502_dateArriveeGeneve_Marion", je réponds 13 ans
    Et à la question "0501_domicileCantonGE_Josep", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Josep", je réponds "12.01.2007"
    # Et à la question "0502_dateArriveeGeneve_Josep", je réponds 13 ans
    Et à la question "0601_revenus_Marion", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Marion", je réponds "NON"
    Et à la question "0601_revenus_Josep", je réponds "EMPLOI"
    Et à la question "0601_revenus_Léon", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Léon", je réponds "NON"
    Et à la question "0601_revenus_Antoine", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Antoine", je réponds "NON"
    Et à la question "0601_revenus_Noémie", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Marion", je réponds "50"
    Et à la question "0902_tauxActivite_Josep", je réponds "50"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Marion", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Josep", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Léon", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Antoine", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Noémie", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est déjà perçue
    Alors la prestation "PC_FAM" est éligible
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Marion" est refusée
    Alors la prestation "BOURSES_Josep" est refusée
    Alors la prestation "BOURSES_Léon" est refusée
    Alors la prestation "BOURSES_Antoine" est éligible
    Alors la prestation "BOURSES_Noémie" est refusée
