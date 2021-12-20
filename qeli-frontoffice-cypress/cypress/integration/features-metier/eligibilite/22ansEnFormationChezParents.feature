# language: fr
Fonctionnalité: Jeune de 22 ans en formation, chez ses parents
  On teste le cas d'un jeune de 22 ans en formation vivant chez ses parents

  Scénario: 4 - Jeune de 22 ans en formation, chez ses parents, Bachelor, Subsides, Suisse, habitant à Genève depuis la naissance, travaille 20%, Pas sur le bail, assurance maladie LaMAL, IBO, pas de fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 22 ans et je m'appelle "Léon"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "SUBSIDES_Léon"
    Et à la question "0702_formation_Léon", je réponds "OUI "
    Et à la question "0701_scolarite_Léon", je réponds "COLLEGE_APRENTISSAGE"
    Et à la question "0401_nationalite_Léon", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Léon", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Léon", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Léon", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Léon", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "NON"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Léon", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Léon" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible


  Scénario: 4 - Formulaire parents Jeune de 22 ans en formation, chez ses parents, Bachelor, Subsides, Suisse, habitant à Genève depuis la naissance, travaille 20%, Pas sur le bail, assurance maladie LaMAL, IBO, pas de fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 46 ans et je m'appelle "Sabrina"
    Et que j'ai un "EPOUX", qui a 48 ans et il s'appelle "Sylvain"
    Et que j'ai un "ENFANT", qui a 22 ans et il s'appelle "Elouan"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Elouan", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "SUBSIDES_Sabrina, SUBSIDES_Sylvain, SUBSIDES_Elouan"
    Et à la question "0702_formation_Sabrina", je réponds "NON" sans validation
    Et à la question "0702_formation_Sylvain", je réponds "NON" sans validation
    Et à la question "0702_formation_Elouan", je réponds "OUI "
    Et à la question "0701_scolarite_Elouan", je réponds "COLLEGE_APRENTISSAGE"
    Et à la question "0401_nationalite_Sabrina", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Sylvain", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Elouan", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Sabrina", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Sabrina", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Sylvain", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Sylvain", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Sabrina", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Sabrina", je réponds "NON"
    Et à la question "0601_revenus_Sylvain", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Sylvain", je réponds "NON"
    Et à la question "0601_revenus_Elouan", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Elouan", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Sabrina", je réponds "90"
    Et à la question "0902_tauxActivite_Sylvain", je réponds "80"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "4"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Sabrina", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Sylvain", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Elouan", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Sabrina" est refusée
    Alors la prestation "BOURSES_Sylvain" est refusée
    Alors la prestation "BOURSES_Elouan" est éligible
    Alors la prestation "PC_FAM" est éligible
    Alors la prestation "AIDE_SOCIALE" est éligible

  Scénario: 5 - Jeune de 22 ans en formation, chez ses parents et fratrie, Français, Permis C, habitant Genève depuis 3 ans, travaille 20%, Pas sur le bail, assurance maladie LaMAL, Taxé d'office, Fortune 15'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 22 ans et je m'appelle "Arnaud"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Arnaud", je réponds "OUI "
    Et à la question "0701_scolarite_Arnaud", je réponds "COLLEGE_APRENTISSAGE"
    Et à la question "0401_nationalite_Arnaud", je réponds "fr"
    Et à la question "0407_typePermis_Arnaud", je réponds "C" sans validation    
    Et à la question "0408_complementPermisC_Arnaud", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Arnaud", je réponds "03.12.2017"
    # Et à la question "0409_dateArriveeSuisse_Arnaud", je réponds 3 ans
    Et à la question "0501_domicileCantonGE_Arnaud", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Arnaud", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Arnaud", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Arnaud", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "AUTRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "NON"
    Et à la question "1101_assuranceMaladieSuisse_Arnaud", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "OUI"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Arnaud", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est refusée

  Scénario: 7 - Jeune de 22 ans en formation, chez ses parents, fratrie et son enfant de 3 ans, Bachelor, fratrie au collège, enfant à la crèche, Français, permis C, habitant Genève depuis 7 ans, travaille 50%, Pas sur le bail, assurance maladie LaMAL, Taxation classique, pas de fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 22 ans et je m'appelle "Thomas"
    Et que j'ai un "ENFANT", qui a 3 ans et il s'appelle "Marcel"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Marcel", je réponds "MOI"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Thomas", je réponds "OUI"
    Et à la question "0702_formation_Marcel", je réponds "NON"
    Et à la question "0701_scolarite_Thomas", je réponds "COLLEGE_APRENTISSAGE"
    Et à la question "0401_nationalite_Thomas", je réponds "fr" sans validation
    Et à la question "0401_nationalite_Marcel", je réponds "fr"
    Et à la question "0407_typePermis_Thomas", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Thomas", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Thomas", je réponds "03.12.2013"
    # Et à la question "0409_dateArriveeSuisse_Thomas", je réponds 7 ans
    Et à la question "0407_typePermis_Marcel", je réponds "B" sans validation
    Et à la question "0408_complementPermisB_Marcel", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Marcel", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Thomas", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Thomas", je réponds "12.01.2013"
    Et à la question "0601_revenus_Thomas", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Thomas", je réponds "NON"
    Et à la question "0601_revenus_Marcel", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Thomas", je réponds "50"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "AUTRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "NON"
    Et à la question "1101_assuranceMaladieSuisse_Thomas", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Marcel", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Thomas", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Marcel", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Thomas" est éligible
    Alors la prestation "BOURSES_Marcel" est refusée
    Alors la prestation "PC_FAM" est éligible
    Alors la prestation "AIDE_SOCIALE" est éligible

  Scénario: 8 - Jeune de 22 ans en formation, chez sa mère et fratrie, bachelor, fratrie au collège, Suisse, habitant à Genève depuis la naissance, mère fonctionnaire internationale, travaille 20%, Pas sur le bail, assurance maladie spéciale, Exempté d'impôt, fortune de 100'000.- donc impôt sur la fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 22 ans et je m'appelle "Léo"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Léo", je réponds "OUI "
    Et à la question "0701_scolarite_Léo", je réponds "COLLEGE_APRENTISSAGE"
    Et à la question "0401_nationalite_Léo", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Léo", je réponds "OUI"
    Et à la question "0502_dateArriveeGeneve_Léo", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Léo", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Léo", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "NON"
    Et à la question "1101_assuranceMaladieSuisse", je réponds "NON"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "OUI"
    Et à la question "1403_fonctionnaireInternational_Léo", je réponds "OUI"
    Alors la prestation "SUBSIDES" est refusée
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Léo" est refusée
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est refusée

