# language: fr
Fonctionnalité: Couple avec des enfants dans le domicile mais le demandeur n'a pas d'enfant
  Test des cas de Couples avec des enfants dans le domicile mais le demandeur n'a pas d'enfant

  Scénario: 14 - marié, avec juste enfant du conjoint 17 ans en formation, école de commerce,Afghan (autre pays), permis B, à Genève depuis 15 ans, 2 travaillent 40%, Locataire à la GIM, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 48 ans et je m'appelle "Elodie"
    Et que j'ai un "EPOUX", qui a 55 ans et il s'appelle "Philippe"
    Et que j'ai un "ENFANT", qui a 17 ans et il s'appelle "Eva"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Eva", je réponds "AUTRE_PARENT"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Elodie", je réponds "NON" sans validation
    Et à la question "0702_formation_Philippe", je réponds "NON" sans validation
    Et à la question "0702_formation_Eva", je réponds "OUI"
    Et à la question "0701_scolarite_Eva", je réponds "ECOLE_SUPERIEUR"
    Et à la question "0401_nationalite_Elodie", je réponds "af" sans validation
    Et à la question "0401_nationalite_Philippe", je réponds "af" sans validation
    Et à la question "0401_nationalite_Eva", je réponds "af"
    Et à la question "0407_typePermis_Elodie", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Elodie", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Elodie", je réponds "03.12.2006"
    # Et à la question "0409_dateArriveeSuisse_Elodie", je réponds 15 ans
    Et à la question "0407_typePermis_Philippe", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Philippe", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Philippe", je réponds "03.12.2005"
    # Et à la question "0409_dateArriveeSuisse_Philippe", je réponds 15 ans  
    Et à la question "0407_typePermis_Eva", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Eva", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Eva", je réponds "03.12.2005"
    # Et à la question "0409_dateArriveeSuisse_Eva", je réponds 15 ans
    Et à la question "0501_domicileCantonGE_Elodie", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Elodie", je réponds "12.01.2005"
    # Et à la question "0502_dateArriveeGeneve_Elodie", je réponds 15 ans
    Et à la question "0501_domicileCantonGE_Philippe", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Philippe", je réponds "12.01.2005"
    # Et à la question "0502_dateArriveeGeneve_Philippe", je réponds 15 ans
    Et à la question "0601_revenus_Elodie", je réponds "EMPLOI"
    Et à la question "0601_revenus_Philippe", je réponds "EMPLOI"
    Et à la question "0601_revenus_Eva", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Elodie", je réponds "40"
    Et à la question "0902_tauxActivite_Philippe", je réponds "40"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "AUTRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "EN_FONCTION_REVENU"
    Et à la question "1101_assuranceMaladieSuisse_Elodie", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Philippe", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Eva", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Elodie", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Philippe", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Eva", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refuse
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Elodie" est refusée
    Alors la prestation "BOURSES_Philippe" est refusée
    Alors la prestation "BOURSES_Eva" est éligible

  Scénario: 19 - célibataire, avec un concubin, juste enfant du concubin 11 ans,école primaire, Subsides, tous suisses, à Genève depuis naissance, 1 chômage 100% , 1 travaille 100%, Locataire 4 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 36 ans et je m'appelle "Jennifer"
    Et que j'ai un "CONCUBIN", qui a 37 ans et il s'appelle "Hubert"
    Et que j'ai un "ENFANT", qui a 11 ans et il s'appelle "Cyrielle"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Cyrielle", je réponds "AUTRE_PARENT"
    Et à la question "0101_prestations", je coche "SUBSIDES_Jennifer, SUBSIDES_Hubert, SUBSIDES_Cyrielle"
    Et à la question "0702_formation_Jennifer", je réponds "NON" sans validation
    Et à la question "0702_formation_Hubert", je réponds "NON" sans validation
    Et à la question "0702_formation_Cyrielle", je réponds "OUI"
    Et à la question "0701_scolarite_Cyrielle", je réponds "SCOLARITE_OBLIGATOIRE_1P_A_10P"
    Et à la question "0401_nationalite_Jennifer", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Hubert", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Cyrielle", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Jennifer", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Jennifer", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Jennifer", je réponds "CHOMAGE" sans validation
    Et à la question "0602_situationRente_Jennifer", je réponds "NON"
    Et à la question "0601_revenus_Cyrielle", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "4"
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
