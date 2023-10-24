# language: fr
Fonctionnalité: Couple sans enfant
  On teste les cas de couples sans enfant

  Scénario: 9 - mariés, pas d'enfant, Américains, à Genève depuis 6 ans, 2 travaillent 100%, Locataires 5 pièces, pas d'assurance maladie, Fonctionnaires internationnaux, exemptés d'impôts, fortune 100'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 30 ans et je m'appelle "Alix"
    Et que j'ai un "EPOUX", qui a 31 ans et il s'appelle "Numa"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Alix", je réponds "NON" sans validation
    Et à la question "0702_formation_Numa", je réponds "NON"
    Et à la question "0401_nationalite_Alix", je réponds "us" sans validation
    Et à la question "0401_nationalite_Numa", je réponds "us"
    Et à la question "0407_typePermis_Alix", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Alix", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Alix", je réponds "03.12.2014"
    # Et à la question "0409_dateArriveeSuisse_Alix", je réponds 6 ans
    Et à la question "0407_typePermis_Numa", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Numa", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Numa", je réponds "03.12.2014"
    # Et à la question "0409_dateArriveeSuisse_Numa", je réponds 6 ans
    Et à la question "0501_domicileCantonGE_Alix", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Alix", je réponds "03.12.2014"
    Et à la question "0501_domicileCantonGE_Numa", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Numa", je réponds "03.12.2014"
    Et à la question "0601_revenus_Alix", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Alix", je réponds "NON"
    Et à la question "0601_revenus_Numa", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Numa", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1101_assuranceMaladieSuisse_Alix", je réponds "NON" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Numa", je réponds "NON"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "OUI"
    Alors la prestation "SUBSIDES" est refusée
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est refusée
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES" est refusée


  Scénario: 30 - mariés, suisses, à Genève depuis naissance, 1 Retraité avec rente , 1 travaille 80%, Locataire 5 pièces, assurance maladie LaMAL, Taxation classique, fortune 50'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 59 ans et je m'appelle "Sophie"
    Et que j'ai un "EPOUX", qui a 65 ans et il s'appelle "Marc"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Sophie", je réponds "NON" sans validation
    Et à la question "0702_formation_Marc", je réponds "NON"
    Et à la question "0401_nationalite_Sophie", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Marc", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Sophie", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Sophie", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Marc", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Marc", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Sophie", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Sophie", je réponds "NON"
    Et à la question "0601_revenus_Marc", je réponds "AVS_RETRAITE"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1101_assuranceMaladieSuisse_Sophie", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Marc", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "OUI"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est refusée
    Alors la prestation "PC_AVS_AI" est éligible
    Alors la prestation "BOURSES" est refusée

  Scénario: 32 - mariés, suisses, à Genève depuis naissance, 1 Retraité avec rente , 1 travaille 80%, Locataire 5 pièces, assurance maladie LaMAL, Taxation classique, fortune 50'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 66 ans et je m'appelle "Solveig"
    Et que j'ai un "EPOUX", qui a 65 ans et il s'appelle "Yniold"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "SUBSIDES_Solveig, SUBSIDES_Yniold"
    Et à la question "0702_formation_Solveig", je réponds "NON" sans validation
    Et à la question "0702_formation_Yniold", je réponds "NON"
    Et à la question "0401_nationalite_Solveig", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Yniold", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Solveig", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Solveig", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Yniold", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Yniold", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Solveig", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Solveig", je réponds "RETRAITE_SANS_RENTE"
    Et à la question "0601_revenus_Yniold", je réponds "AVS_RETRAITE"
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
    Alors la prestation "PC_AVS_AI" est éligible
    Alors la prestation "BOURSES" est refusée

  Scénario: 25 - marié, avec enfant en commun 20 ans qui travaille, Subsides, tous suisses, à Genève depuis naissance, 1 chômage 50% , 1 travaille 50%, Locataire 5 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 50 ans et je m'appelle "David"
    Et que j'ai un "EPOUX", qui a 51 ans et il s'appelle "Valérie"
    Et que j'ai un "ENFANT", qui a 20 ans et il s'appelle "Inés"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Inés", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "SUBSIDES_David, SUBSIDES_Valérie, SUBSIDES_Inés"
    Et à la question "0702_formation_David", je réponds "NON" sans validation
    Et à la question "0702_formation_Valérie", je réponds "NON" sans validation
    Et à la question "0702_formation_Inés", je réponds "NON"
    Et à la question "0401_nationalite_David", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Valérie", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Inés", je réponds "ch"
    Et à la question "0501_domicileCantonGE_David", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_David", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Valérie", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Valérie", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_David", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_David", je réponds "NON"
    Et à la question "0601_revenus_Valérie", je réponds "CHOMAGE" sans validation
    Et à la question "0602_situationRente_Valérie", je réponds "NON"
    Et à la question "0601_revenus_Inés", je réponds "CHOMAGE" sans validation
    Et à la question "0602_situationRente_Inés", je réponds "NON"
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
