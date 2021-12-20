# language: fr
Fonctionnalité: Couple marié avec des enfants à charge
  On teste les couples mariés avec des enfants à charge

  Scénario: 11 - marié, avec un enfant propre 20 ans en formation et un en commun 12 ans, collège, école primaire, tous suisses, à Genève depuis naissance, 1 travaille 100% l'autre ne travaille pas, Propritaire, assurance maladie LaMAL, Taxation classique, fortune de 500'000.- donc impôt sur la fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 46 ans et je m'appelle "Amandine"
    Et que j'ai un "EPOUX", qui a 48 ans et il s'appelle "Franck"
    Et que j'ai un "ENFANT", qui a 20 ans et il s'appelle "Grégoire"
    Et que j'ai un "ENFANT", qui a 12 ans et il s'appelle "Ayla"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Grégoire", je réponds "MOI"
    Et à la question "0506_parentsEnfants_Ayla", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Amandine", je réponds "NON" sans validation
    Et à la question "0702_formation_Franck", je réponds "NON" sans validation
    Et à la question "0702_formation_Grégoire", je réponds "OUI " sans validation
    Et à la question "0702_formation_Ayla", je réponds "OUI "
    Et à la question "0701_scolarite_Grégoire", je réponds "ECOLE_SUPERIEUR"
    Et à la question "0701_scolarite_Ayla", je réponds "SCOLARITE_OBLIGATOIRE_1P_A_10P"
    Et à la question "0401_nationalite_Amandine", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Franck", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Grégoire", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Ayla", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Amandine", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Amandine", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Franck", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Franck", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Amandine", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Amandine", je réponds "NON"
    Et à la question "0601_revenus_Franck", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Franck", je réponds "NON"
    Et à la question "0601_revenus_Grégoire", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Grégoire", je réponds "NON"
    Et à la question "0601_revenus_Ayla", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Franck", je réponds "100"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "PROPRIETAIRE"
    Et à la question "1101_assuranceMaladieSuisse_Amandine", je réponds "OUI " sans validation
    Et à la question "1101_assuranceMaladieSuisse_Franck", je réponds "OUI " sans validation
    Et à la question "1101_assuranceMaladieSuisse_Grégoire", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Ayla", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "OUI"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Amandine", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Franck", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Grégoire", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Ayla", je réponds "NON"
    Alors la prestation "SUBSIDES_Amandine" est éligible
    Alors la prestation "SUBSIDES_Franck" est éligible
    Alors la prestation "SUBSIDES_Grégoire" est éligible
    Alors la prestation "SUBSIDES_Ayla" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_FAM" est éligible
    Alors la prestation "AIDE_SOCIALE" est refusée
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Amandine" est refusée
    Alors la prestation "BOURSES_Franck" est refusée
    Alors la prestation "BOURSES_Grégoire" est éligible
    Alors la prestation "BOURSES_Ayla" est refusée

  Scénario: 12 - marié, avec un enfant propre chacun (21 ans en formation; 23 ans en emploi) et un en commun 19 ans en formation, Haute école de gestion (21), collège (19 ans), mère française (UE), père afghan (autre pays), à Genève depuis 4 ans, en Suisse depuis 15 ans, 2 travaillent 100% , Locataire 6 pièces, assurance maladie LaMAL, Taxation classique, fortune 50'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 46 ans et je m'appelle "Marion"
    Et que j'ai un "EPOUX", qui a 48 ans et il s'appelle "Josep"
    Et que j'ai un "ENFANT", qui a 21 ans et il s'appelle "Léon"
    Et que j'ai un "ENFANT", qui a 23 ans et il s'appelle "Antoine"
    Et que j'ai un "ENFANT", qui a 19 ans et il s'appelle "Noémie"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Léon", je réponds "MOI"
    Et à la question "0506_parentsEnfants_Antoine", je réponds "AUTRE_PARENT"
    Et à la question "0506_parentsEnfants_Noémie", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Marion", je réponds "NON" sans validation
    Et à la question "0702_formation_Josep", je réponds "NON" sans validation
    Et à la question "0702_formation_Léon", je réponds "OUI " sans validation
    Et à la question "0702_formation_Antoine", je réponds "NON" sans validation
    Et à la question "0702_formation_Noémie", je réponds "OUI"
    Et à la question "0701_scolarite_Léon", je réponds "ECOLE_SUPERIEUR"
    Et à la question "0701_scolarite_Noémie", je réponds "COLLEGE_APRENTISSAGE"
    Et à la question "0401_nationalite_Marion", je réponds "fr" sans validation
    Et à la question "0401_nationalite_Josep", je réponds "af" sans validation
    Et à la question "0401_nationalite_Léon", je réponds "fr" sans validation
    Et à la question "0401_nationalite_Antoine", je réponds "af" sans validation
    Et à la question "0401_nationalite_Noémie", je réponds "fr" 
    Et à la question "0407_typePermis_Marion", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Marion", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Marion", je réponds "03.12.2005"
    # Et à la question "0409_dateArriveeSuisse_Marion", je réponds 15 ans
    Et à la question "0407_typePermis_Josep", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Josep", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Josep", je réponds "03.12.2005"
    # Et à la question "0409_dateArriveeSuisse_Josep", je réponds 15 ans
    Et à la question "0407_typePermis_Léon", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Léon", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Léon", je réponds "03.12.2005"
    # Et à la question "0409_dateArriveeSuisse_Léon", je réponds 15 ans
    Et à la question "0407_typePermis_Antoine", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Antoine", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Antoine", je réponds "03.12.2005"
    # Et à la question "0409_dateArriveeSuisse_Antoine", je réponds 15 ans 
    Et à la question "0407_typePermis_Noémie", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Noémie", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Noémie", je réponds "03.12.2005"
    # Et à la question "0409_dateArriveeSuisse_Noémie", je réponds 15 ans
    Et à la question "0501_domicileCantonGE_Marion", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Marion", je réponds "12.01.2016"
     # Et à la question "0502_dateArriveeGeneve_Marion", je réponds 4 ans
    Et à la question "0501_domicileCantonGE_Josep", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Josep", je réponds "12.01.2016"
    # Et à la question "0502_dateArriveeGeneve_Josep", je réponds 4 ans
    Et à la question "0601_revenus_Marion", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Marion", je réponds "NON"
    Et à la question "0601_revenus_Josep", je réponds "EMPLOI"
    Et à la question "0601_revenus_Léon", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Léon", je réponds "NON"
    Et à la question "0601_revenus_Antoine", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Antoine", je réponds "NON"
    Et à la question "0601_revenus_Noémie", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Noémie", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "6"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1101_assuranceMaladieSuisse_Marion", je réponds "OUI " sans validation
    Et à la question "1101_assuranceMaladieSuisse_Josep", je réponds "OUI " sans validation
    Et à la question "1101_assuranceMaladieSuisse_Léon", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Antoine", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Noémie", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "OUI"
    Et à la question "1301_impotFortune", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Marion", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Josep", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Léon", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Antoine", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Noémie", je réponds "NON"
    Alors la prestation "SUBSIDES_Josep" est éligible
    Alors la prestation "SUBSIDES_Léon" est éligible
    Alors la prestation "SUBSIDES_Antoine" est éligible
    Alors la prestation "SUBSIDES_Noémie" est éligible
    Alors la prestation "SUBSIDES_Marion" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est refusée
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Marion" est refusée
    Alors la prestation "BOURSES_Josep" est refusée
    Alors la prestation "BOURSES_Léon" est éligible
    Alors la prestation "BOURSES_Antoine" est refusée
    Alors la prestation "BOURSES_Noémie" est éligible

  Scénario: 13 - marié, avec enfant en commun 19 ans en formation, collège , Afghan (autre pays), permis B, à Genève depuis 6 ans, 2 travaillent 50%, Locataire 4 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 46 ans et je m'appelle "Marion"
    Et que j'ai un "EPOUX", qui a 48 ans et il s'appelle "Colin"
    Et que j'ai un "ENFANT", qui a 19 ans et il s'appelle "Léa"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Léa", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Marion", je réponds "NON" sans validation
    Et à la question "0702_formation_Colin", je réponds "NON" sans validation
    Et à la question "0702_formation_Léa", je réponds "OUI "
    Et à la question "0701_scolarite_Léa", je réponds "ECOLE_SUPERIEUR"
    Et à la question "0401_nationalite_Marion", je réponds "af" sans validation
    Et à la question "0401_nationalite_Colin", je réponds "af" sans validation
    Et à la question "0401_nationalite_Léa", je réponds "af" 
    Et à la question "0407_typePermis_Marion", je réponds "B" sans validation
    Et à la question "0408_complementPermisB_Marion", je réponds "REFUGIE" sans validation
    Et à la question "0409_dateArriveeSuisse_Marion", je réponds "03.12.2014"
    # Et à la question "0409_dateArriveeSuisse_Marion", je réponds 6 ans
    Et à la question "0407_typePermis_Colin", je réponds "B" sans validation
    Et à la question "0408_complementPermisB_Colin", je réponds "REFUGIE" sans validation
    Et à la question "0409_dateArriveeSuisse_Colin", je réponds "03.12.2014"
    # Et à la question "0409_dateArriveeSuisse_Colin", je réponds 6 ans
    Et à la question "0407_typePermis_Léa", je réponds "B" sans validation
    Et à la question "0408_complementPermisB_Léa", je réponds "REFUGIE" sans validation
    Et à la question "0409_dateArriveeSuisse_Léa", je réponds "03.12.2014"
    # Et à la question "0409_dateArriveeSuisse_Léa", je réponds 6 ans
    Et à la question "0501_domicileCantonGE_Marion", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Marion", je réponds "03.12.2014"
     # Et à la question "0502_dateArriveeGeneve_Marion", je réponds 6 ans
    Et à la question "0501_domicileCantonGE_Colin", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Colin", je réponds "03.12.2014"
    # Et à la question "0502_dateArriveeGeneve_Colin", je réponds 6 ans
    Et à la question "0601_revenus_Marion", je réponds "EMPLOI"
    Et à la question "0601_revenus_Colin", je réponds "EMPLOI"
    Et à la question "0601_revenus_Léa", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Marion", je réponds "50"
    Et à la question "0902_tauxActivite_Colin", je réponds "50"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "4"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1101_assuranceMaladieSuisse_Marion", je réponds "OUI " sans validation
    Et à la question "1101_assuranceMaladieSuisse_Colin", je réponds "OUI " sans validation
    Et à la question "1101_assuranceMaladieSuisse_Léa", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    # Et à la question "1403_fonctionnaireInternational_Marion", je réponds "NON" sans validation
    # Et à la question "1403_fonctionnaireInternational_Colin", je réponds "NON" sans validation
    # Et à la question "1403_fonctionnaireInternational_Léa", je réponds "NON"
    Alors la prestation "SUBSIDES_Marion" est éligible
    Alors la prestation "SUBSIDES_Léa" est éligible
    Alors la prestation "SUBSIDES_Colin" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est éligible
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Marion" est refusée
    Alors la prestation "BOURSES_Colin" est refusée
    Alors la prestation "BOURSES_Léa" est éligible

  Scénario: 15 - marié, avec enfant en commun 3 ans et un du conjoint 8 ans, école primaire, déjà Subsides, tous suisses, à Genève depuis naissance, 1 chômage 100% l'autre ne travaille pas, Locataire HLM, assurance maladie LaMAL, Taxation classique, fortune 50'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 36 ans et je m'appelle "Fantine"
    Et que j'ai un "EPOUX", qui a 38 ans et il s'appelle "Jean"
    Et que j'ai un "ENFANT", qui a 3 ans et il s'appelle "Cosette"
    Et que j'ai un "ENFANT", qui a 8 ans et il s'appelle "Marius"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Cosette", je réponds "LES_DEUX"
    Et à la question "0506_parentsEnfants_Marius", je réponds "AUTRE_PARENT"
    Et à la question "0101_prestations", je coche "SUBSIDES_Fantine, SUBSIDES_Jean, SUBSIDES_Cosette, SUBSIDES_Marius"
    Et à la question "0702_formation_Fantine", je réponds "NON" sans validation
    Et à la question "0702_formation_Jean", je réponds "NON" sans validation
    Et à la question "0702_formation_Cosette", je réponds "NON" sans validation
    Et à la question "0702_formation_Marius", je réponds "OUI"
    Et à la question "0701_scolarite_Marius", je réponds "SCOLARITE_OBLIGATOIRE_1P_A_10P"
    Et à la question "0401_nationalite_Fantine", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Jean", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Cosette", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Marius", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Fantine", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Fantine", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Jean", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Jean", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Fantine", je réponds "CHOMAGE" sans validation
    Et à la question "0602_situationRente_Fantine", je réponds "NON"
    Et à la question "0601_revenus_Jean", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Jean", je réponds "NON"
    Et à la question "0601_revenus_Cosette", je réponds "NON"
    Et à la question "0601_revenus_Marius", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0903_tauxActiviteDernierEmploi_Fantine", je réponds "100"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "EN_FONCTION_REVENU"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "OUI"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_FAM" est éligible
    Alors la prestation "AIDE_SOCIALE" est refusée
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Fantine" est refusée
    Alors la prestation "BOURSES_Jean" est refusée
    Alors la prestation "BOURSES_Marius" est refusée
    Alors la prestation "BOURSES_Cosette" est refusée

  Scénario: 23 - marié, avec enfant en commun 10 ans en formation, école primaire, tous suisses, à Genève depuis naissance, 2 chômage 40% , Locataire HLM, assurance maladie LaMAL, Taxé d'office, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 36 ans et je m'appelle "Sandrine"
    Et que j'ai un "EPOUX", qui a 38 ans et il s'appelle "Fred"
    Et que j'ai un "ENFANT", qui a 10 ans et il s'appelle "Emilie"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Emilie", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Sandrine", je réponds "NON" sans validation
    Et à la question "0702_formation_Fred", je réponds "NON" sans validation
    Et à la question "0702_formation_Emilie", je réponds "OUI"
    Et à la question "0701_scolarite_Emilie", je réponds "SCOLARITE_OBLIGATOIRE_1P_A_10P"
    Et à la question "0401_nationalite_Sandrine", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Fred", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Emilie", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Sandrine", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Sandrine", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Fred", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Fred", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Sandrine", je réponds "CHOMAGE" sans validation
    Et à la question "0602_situationRente_Sandrine", je réponds "NON"
    Et à la question "0601_revenus_Fred", je réponds "CHOMAGE" sans validation
    Et à la question "0602_situationRente_Fred", je réponds "NON"
    Et à la question "0601_revenus_Emilie", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "OUI"
    Et à la question "0903_tauxActiviteDernierEmploi_Sandrine", je réponds "10"
    Et à la question "0912_tauxActiviteVariable6DernierMois_Sandrine", je réponds "NON"
    Et à la question "0903_tauxActiviteDernierEmploi_Fred", je réponds "10"
    Et à la question "0912_tauxActiviteVariable6DernierMois_Fred", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "4"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "EN_FONCTION_REVENU"
    Et à la question "1101_assuranceMaladieSuisse_Sandrine", je réponds "OUI " sans validation
    Et à la question "1101_assuranceMaladieSuisse_Fred", je réponds "OUI " sans validation
    Et à la question "1101_assuranceMaladieSuisse_Emilie", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Sandrine" est refusée
    Alors la prestation "BOURSES_Fred" est refusée
    Alors la prestation "BOURSES_Emilie" est refusée

  Scénario: 24 - marié, avec enfant en commun 10 ans en formation, école primaire, Subsides tous suisses, à Genève depuis naissance, 1 chômage 40% , 1 travaille 40%, Locataire HLM, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 36 ans et je m'appelle "Betty"
    Et que j'ai un "EPOUX", qui a 45 ans et il s'appelle "Delphin"
    Et que j'ai un "ENFANT", qui a 10 ans et il s'appelle "Mahaut"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Mahaut", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "SUBSIDES_Betty, SUBSIDES_Delphin, SUBSIDES_Mahaut"
    Et à la question "0702_formation_Betty", je réponds "NON" sans validation
    Et à la question "0702_formation_Delphin", je réponds "NON" sans validation
    Et à la question "0702_formation_Mahaut", je réponds "OUI"
    Et à la question "0701_scolarite_Mahaut", je réponds "SCOLARITE_OBLIGATOIRE_1P_A_10P"
    Et à la question "0401_nationalite_Betty", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Delphin", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Mahaut", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Betty", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Betty", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Delphin", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Delphin", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Betty", je réponds "CHOMAGE" sans validation
    Et à la question "0602_situationRente_Betty", je réponds "NON"
    Et à la question "0601_revenus_Delphin", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Delphin", je réponds "NON"
    Et à la question "0601_revenus_Mahaut", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0903_tauxActiviteDernierEmploi_Betty", je réponds "40"
    Et à la question "0912_tauxActiviteVariable6DernierMois_Betty", je réponds "NON"
    Et à la question "0902_tauxActivite_Delphin", je réponds "40"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "4"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "EN_FONCTION_REVENU"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES" est refusée

  Scénario: 26 - marié, avec enfant en commun 11 ans en formation, école primaire, Subsides, tous suisses, à Genève depuis naissance, 2 travaillent 50%, 2 chômage 50%, Locataire 5 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 36 ans et je m'appelle "Margaux"
    Et que j'ai un "EPOUX", qui a 37 ans et il s'appelle "Théo"
    Et que j'ai un "ENFANT", qui a 11 ans et il s'appelle "Abel"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Abel", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "SUBSIDES_Margaux, SUBSIDES_Théo, SUBSIDES_Abel"
    Et à la question "0702_formation_Margaux", je réponds "NON" sans validation
    Et à la question "0702_formation_Théo", je réponds "NON" sans validation
    Et à la question "0702_formation_Abel", je réponds "OUI"
    Et à la question "0701_scolarite_Abel", je réponds "SCOLARITE_OBLIGATOIRE_1P_A_10P"
    Et à la question "0401_nationalite_Margaux", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Théo", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Abel", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Margaux", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Margaux", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Théo", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Théo", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Margaux", je réponds "EMPLOI, CHOMAGE" sans validation
    Et à la question "0602_situationRente_Margaux", je réponds "NON"
    Et à la question "0601_revenus_Théo", je réponds "EMPLOI, CHOMAGE" sans validation
    Et à la question "0602_situationRente_Théo", je réponds "NON"
    Et à la question "0601_revenus_Abel", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Margaux", je réponds "50"
    Et à la question "0903_tauxActiviteDernierEmploi_Margaux", je réponds "50"
    Et à la question "0902_tauxActivite_Théo", je réponds "50"
    Et à la question "0903_tauxActiviteDernierEmploi_Théo", je réponds "50"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "INCONNU"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est éligible
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES" est refusée

  Scénario: 27 - marié, avec enfant en commun 10 ans en formation, école primaire, Subsides, tous suisses, à Genève depuis naissance, 2 travaillent 20%, 2 chômage variable 20%, Locataire GIM 5 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 36 ans et je m'appelle "Jennifer"
    Et que j'ai un "EPOUX", qui a 37 ans et il s'appelle "Hubert"
    Et que j'ai un "ENFANT", qui a 10 ans et il s'appelle "Cyrielle"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Cyrielle", je réponds "LES_DEUX"
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
    Et à la question "0501_domicileCantonGE_Hubert", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Hubert", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Jennifer", je réponds "EMPLOI, CHOMAGE" sans validation
    Et à la question "0602_situationRente_Jennifer", je réponds "NON"
    Et à la question "0601_revenus_Hubert", je réponds "EMPLOI, CHOMAGE" sans validation
    Et à la question "0602_situationRente_Hubert", je réponds "NON"
    Et à la question "0601_revenus_Cyrielle", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Jennifer", je réponds "20"
    Et à la question "0903_tauxActiviteDernierEmploi_Jennifer", je réponds "10"
    Et à la question "0912_tauxActiviteVariable6DernierMois_Jennifer", je réponds "OUI"
    Et à la question "0905_tauxActiviteMoyen6DernierMois_Jennifer", je réponds "20"
    Et à la question "0902_tauxActivite_Hubert", je réponds "20"
    Et à la question "0903_tauxActiviteDernierEmploi_Hubert", je réponds "10"
    Et à la question "0912_tauxActiviteVariable6DernierMois_Hubert", je réponds "OUI"
    Et à la question "0905_tauxActiviteMoyen6DernierMois_Hubert", je réponds "20"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "INCONNU"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES" est refusée

  Scénario: 39 - Mariés avec enfant propre 17 as en formation, école de commerce, Aide sociale, UE, à Genève depuis 15 ans, Sans travail (pas droit au chômage), Locataire 5 pièces, assurance maladie LaMAL, Taxation classique, pas de fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 36 ans et je m'appelle "Caroline"
    Et que j'ai un "EPOUX", qui a 37 ans et il s'appelle "Baptiste"
    Et que j'ai un "ENFANT", qui a 17 ans et il s'appelle "Suzon"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Suzon", je réponds "MOI"
    Et à la question "0101_prestations", je coche "AIDE_SOCIALE"
    Et à la question "0702_formation_Caroline", je réponds "NON" sans validation
    Et à la question "0702_formation_Baptiste", je réponds "NON" sans validation
    Et à la question "0702_formation_Suzon", je réponds "OUI"
    Et à la question "0701_scolarite_Suzon", je réponds "ECOLE_SUPERIEUR"
    Et à la question "0401_nationalite_Caroline", je réponds "fr" sans validation
    Et à la question "0401_nationalite_Baptiste", je réponds "fr" sans validation
    Et à la question "0401_nationalite_Suzon", je réponds "fr"
    Et à la question "0407_typePermis_Caroline", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Caroline", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Caroline", je réponds "03.12.2005"
    # Et à la question "0409_dateArriveeSuisse_Caroline", je réponds 15 ans
     Et à la question "0407_typePermis_Baptiste", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Baptiste", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Baptiste", je réponds "03.12.2005"
    # Et à la question "0409_dateArriveeSuisse_Baptiste", je réponds 15 ans
    Et à la question "0407_typePermis_Suzon", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Suzon", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Suzon", je réponds "03.12.2005"
    # Et à la question "0409_dateArriveeSuisse_Suzon", je réponds 15 ans
    Et à la question "0501_domicileCantonGE_Caroline", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Caroline", je réponds "12.01.2005"
     #Et à la question "0502_dateArriveeGeneve_Caroline", je réponds 15 ans
    Et à la question "0501_domicileCantonGE_Baptiste", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Baptiste", je réponds "12.01.2005"
     #Et à la question "0502_dateArriveeGeneve_Baptiste", je réponds 15 ans
    Et à la question "0601_revenus_Caroline", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Caroline", je réponds "NON"
    Et à la question "0601_revenus_Baptiste", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Baptiste", je réponds "NON"
    Et à la question "0601_revenus_Suzon", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "INCONNU"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1301_impotFortune", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Caroline", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Baptiste", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Suzon", je réponds "NON"
    Alors la prestation "SUBSIDES" est refusée
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est déjà perçue
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Caroline" est refusée
    Alors la prestation "BOURSES_Baptiste" est refusée
    Alors la prestation "BOURSES_Suzon" est éligible

  Scénario: 41 - Mariés avec enfant propre 16 ans en formation, collège, Autre pays, à Genève depuis 4 ans, aucun ne travaille, Locataire 4 pièces, assurance maladie LaMAL,  Taxation classique, pas de fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 36 ans et je m'appelle "Dorothée"
    Et que j'ai un "EPOUX", qui a 37 ans et il s'appelle "Thomas"
    Et que j'ai un "ENFANT", qui a 16 ans et il s'appelle "Aglaé"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Aglaé", je réponds "MOI"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Dorothée", je réponds "NON" sans validation
    Et à la question "0702_formation_Thomas", je réponds "NON" sans validation
    Et à la question "0702_formation_Aglaé", je réponds "OUI"
    Et à la question "0701_scolarite_Aglaé", je réponds "COLLEGE_APRENTISSAGE"
    Et à la question "0401_nationalite_Dorothée", je réponds "af" sans validation
    Et à la question "0401_nationalite_Thomas", je réponds "af" sans validation
    Et à la question "0401_nationalite_Aglaé", je réponds "af" 
    Et à la question "0407_typePermis_Dorothée", je réponds "B" sans validation
    Et à la question "0408_complementPermisB_Dorothée", je réponds "REFUGIE" sans validation
    Et à la question "0409_dateArriveeSuisse_Dorothée", je réponds "03.12.2016"
    # Et à la question "0409_dateArriveeSuisse_Dorothée", je réponds 4 ans
    Et à la question "0407_typePermis_Thomas", je réponds "B" sans validation
    Et à la question "0408_complementPermisB_Thomas", je réponds "REFUGIE" sans validation
    Et à la question "0409_dateArriveeSuisse_Thomas", je réponds "03.12.2016"
    # Et à la question "0409_dateArriveeSuisse_Thomas", je réponds 4 ans
    Et à la question "0407_typePermis_Aglaé", je réponds "B" sans validation
    Et à la question "0408_complementPermisB_Aglaé", je réponds "REFUGIE" sans validation
    Et à la question "0409_dateArriveeSuisse_Aglaé", je réponds "03.12.2016"
    # Et à la question "0409_dateArriveeSuisse_Aglaé", je réponds 4 ans
    Et à la question "0501_domicileCantonGE_Dorothée", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Dorothée", je réponds "12.01.2016"
    #Et à la question "0502_dateArriveeGeneve_Dorothée", je réponds 4 ans
    Et à la question "0501_domicileCantonGE_Thomas", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Thomas", je réponds "12.01.2016"
    #Et à la question "0502_dateArriveeGeneve_Thomas", je réponds 4 ans
    Et à la question "0601_revenus_Dorothée", je réponds "NON"
    Et à la question "0601_revenus_Thomas", je réponds "NON"
    Et à la question "0601_revenus_Aglaé", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "4"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1101_assuranceMaladieSuisse_Dorothée", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Thomas", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Aglaé", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Thomas" est refusée
    Alors la prestation "BOURSES_Dorothée" est refusée
    Alors la prestation "BOURSES_Aglaé" est éligible

  Scénario: 42 - Mariés avec enfant propre 16 ans en formation, collège, Autre pays, à Genève depuis 14 ans, 1 travaille 20%, l'autre ne travaille pas, Locataire 5 pièces, assurance maladie LaMAL, Taxé d'office, pas de fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 48 ans et je m'appelle "Elodie"
    Et que j'ai un "EPOUX", qui a 55 ans et il s'appelle "Philippe"
    Et que j'ai un "ENFANT", qui a 16 ans et il s'appelle "Eva"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Eva", je réponds "MOI"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Elodie", je réponds "NON" sans validation
    Et à la question "0702_formation_Philippe", je réponds "NON" sans validation
    Et à la question "0702_formation_Eva", je réponds "OUI"
    Et à la question "0701_scolarite_Eva", je réponds "COLLEGE_APRENTISSAGE"
    Et à la question "0401_nationalite_Elodie", je réponds "af" sans validation
    Et à la question "0401_nationalite_Philippe", je réponds "af" sans validation
    Et à la question "0401_nationalite_Eva", je réponds "af"
    Et à la question "0407_typePermis_Elodie", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Elodie", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Elodie", je réponds "03.12.2006"
    # Et à la question "0409_dateArriveeSuisse_Elodie", je réponds 14 ans
    Et à la question "0407_typePermis_Philippe", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Philippe", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Philippe", je réponds "03.12.2006"
    # Et à la question "0409_dateArriveeSuisse_Philippe", je réponds 14 ans  
    Et à la question "0407_typePermis_Eva", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Eva", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Eva", je réponds "03.12.2006"
    # Et à la question "0409_dateArriveeSuisse_Eva", je réponds 14 ans
    Et à la question "0501_domicileCantonGE_Elodie", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Elodie", je réponds "12.01.2006"
    #Et à la question "0502_dateArriveeGeneve_Elodie", je réponds 14 ans
    Et à la question "0501_domicileCantonGE_Philippe", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Philippe", je réponds "12.01.2006"
    #Et à la question "0502_dateArriveeGeneve_Philippe", je réponds 14 ans
    Et à la question "0601_revenus_Elodie", je réponds "EMPLOI"
    Et à la question "0601_revenus_Philippe", je réponds "NON"
    Et à la question "0601_revenus_Eva", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Elodie", je réponds "20"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
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
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Elodie" est refusée
    Alors la prestation "BOURSES_Philippe" est refusée
    Alors la prestation "BOURSES_Eva" est éligible

  Scénario: 22 - marié, avec enfant en commun 24 ans en formation avec emploi, formation continue, Subsides, tous suisses, à Genève depuis naissance, 1 chômage 50%, 1 chômage variable 40 %, Locataire 5 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 46 ans et je m'appelle "Muriel"
    Et que j'ai un "EPOUX", qui a 46 ans et il s'appelle "Bruno"
    Et que j'ai un "ENFANT", qui a 24 ans et il s'appelle "Tanguy"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Tanguy", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "SUBSIDES_Muriel, SUBSIDES_Bruno, SUBSIDES_Tanguy"
    Et à la question "0702_formation_Muriel", je réponds "NON" sans validation
    Et à la question "0702_formation_Bruno", je réponds "NON" sans validation
    Et à la question "0702_formation_Tanguy", je réponds "OUI"
    Et à la question "0701_scolarite_Tanguy", je réponds "FORMATION_CONTINUE_CERTIFIANTE"
    Et à la question "0401_nationalite_Muriel", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Bruno", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Tanguy", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Muriel", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Muriel", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Bruno", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Bruno", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Muriel", je réponds "CHOMAGE" sans validation
    Et à la question "0602_situationRente_Muriel", je réponds "NON"
    Et à la question "0601_revenus_Bruno", je réponds "CHOMAGE" sans validation
    Et à la question "0602_situationRente_Bruno", je réponds "NON"
    Et à la question "0601_revenus_Tanguy", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Tanguy", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0903_tauxActiviteDernierEmploi_Muriel", je réponds "50"
    Et à la question "0912_tauxActiviteVariable6DernierMois_Muriel", je réponds "NON"
    Et à la question "0903_tauxActiviteDernierEmploi_Bruno", je réponds "30"
    Et à la question "0912_tauxActiviteVariable6DernierMois_Bruno", je réponds "OUI"
    Et à la question "0905_tauxActiviteMoyen6DernierMois_Bruno", je réponds "40"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est éligible
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES" est refusée

  Scénario: 35 - mariés, avec enfant en commun (20 ans en formation), bachelor, tous suisses, à Genève depuis naissance, 1 travaille 100%, 1 AI avec rente , Locataire 5 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 46 ans et je m'appelle "Isabelle"
    Et que j'ai un "EPOUX", qui a 46 ans et il s'appelle "Marc"
    Et que j'ai un "ENFANT", qui a 20 ans et il s'appelle "Eric"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Eric", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Isabelle", je réponds "NON" sans validation
    Et à la question "0702_formation_Marc", je réponds "NON" sans validation
    Et à la question "0702_formation_Eric", je réponds "OUI"
    Et à la question "0701_scolarite_Eric", je réponds "ECOLE_SUPERIEUR"
    Et à la question "0401_nationalite_Isabelle", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Marc", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Eric", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Isabelle", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Isabelle", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Marc", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Marc", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Isabelle", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Isabelle", je réponds "NON"
    Et à la question "0601_revenus_Marc", je réponds "AI_INVALIDITE"
    Et à la question "0601_revenus_Eric", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Eric", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1101_assuranceMaladieSuisse_Isabelle", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Marc", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Eric", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Isabelle", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Marc", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Eric", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est éligible
    Alors la prestation "BOURSES_Isabelle" est refusée
    Alors la prestation "BOURSES_Marc" est refusée
    Alors la prestation "BOURSES_Eric" est éligible

  Scénario: 40 - Mariés avec enfant propre 16 ans en formation, collège, suisse, à Genève depuis la naissance, 2 travaillent 100%, Coopérative, assurance maladie LaMAL, Taxation classique, fortune 50'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 46 ans et je m'appelle "Claire"
    Et que j'ai un "EPOUX", qui a 46 ans et il s'appelle "Maxence"
    Et que j'ai un "ENFANT", qui a 20 ans et il s'appelle "Louis"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Louis", je réponds "MOI"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Claire", je réponds "NON" sans validation
    Et à la question "0702_formation_Maxence", je réponds "NON" sans validation
    Et à la question "0702_formation_Louis", je réponds "OUI"
    Et à la question "0701_scolarite_Louis", je réponds "ECOLE_SUPERIEUR"
    Et à la question "0401_nationalite_Claire", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Maxence", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Louis", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Claire", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Claire", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Maxence", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Maxence", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Claire", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Claire", je réponds "NON"
    Et à la question "0601_revenus_Maxence", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Maxence", je réponds "NON"
    Et à la question "0601_revenus_Louis", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Louis", je réponds "NON"
    Et à la question "0901_taxationOffice", je réponds "NON"
    Et à la question "0902_tauxActivite_Claire", je réponds "100"
    Et à la question "0902_tauxActivite_Maxence", je réponds "100"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "AUTRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1101_assuranceMaladieSuisse_Claire", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Maxence", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Louis", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "OUI"
    Et à la question "1301_impotFortune", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Claire", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Maxence", je réponds "NON" sans validation
    Et à la question "1403_fonctionnaireInternational_Louis", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est éligible
    Alors la prestation "AIDE_SOCIALE" est refusée
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Claire" est refusée
    Alors la prestation "BOURSES_Maxence" est refusée
    Alors la prestation "BOURSES_Louis" est éligible

  Scénario: 29 - mariés, enfant en commun 27 ans en formation , doctorat, tous suisses, à Genève depuis naissance, Retraités avec rente , Locataire 5 pièces, assurance maladie LaMAL, Taxation classique, fortune 100'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "MARIE", j'ai 46 ans et je m'appelle "Marthe"
    Et que j'ai un "EPOUX", qui a 45 ans et il s'appelle "Christophe"
    Et que j'ai un "ENFANT", qui a 27 ans et il s'appelle "Coralie"
    Et que je passe à la question suivante
    Quand à la question "0506_parentsEnfants_Coralie", je réponds "LES_DEUX"
    Et à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Marthe", je réponds "NON" sans validation
    Et à la question "0702_formation_Christophe", je réponds "NON" sans validation
    Et à la question "0702_formation_Coralie", je réponds "OUI"
    Et à la question "0701_scolarite_Coralie", je réponds "UNIVERSITE_DOCTORAT"
    Et à la question "0401_nationalite_Marthe", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Christophe", je réponds "ch" sans validation
    Et à la question "0401_nationalite_Coralie", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Marthe", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Marthe", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0501_domicileCantonGE_Christophe", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Christophe", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Marthe", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Marthe", je réponds "RETRAITE_SANS_RENTE"
    Et à la question "0601_revenus_Christophe", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Christophe", je réponds "RETRAITE_SANS_RENTE"
    Et à la question "0601_revenus_Coralie", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Coralie", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "5"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1101_assuranceMaladieSuisse_Marthe", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Christophe", je réponds "OUI" sans validation
    Et à la question "1101_assuranceMaladieSuisse_Coralie", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "OUI"
    Et à la question "1301_impotFortune", je réponds "OUI"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est refusée
    Alors la prestation "PC_AVS_AI" est éligible
    Alors la prestation "BOURSES" est refusée
