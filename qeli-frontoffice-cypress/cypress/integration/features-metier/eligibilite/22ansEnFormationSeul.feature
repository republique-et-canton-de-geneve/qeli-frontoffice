# language: fr
Fonctionnalité: Jeune de 22 ans en formation, seul
  On teste le cas d'un jeune de 22 ans en formation vivant seul

  Scénario: 1 - Permis B étudiant, Français, habitant à Genève depuis 2 ans , travaille 10 pourcents, Locataire 2 pièces, assurance maladie LaMAL, Taxation classique, pas de fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 22 ans et je m'appelle "Antoine"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Antoine", je réponds "OUI "
    Et à la question "0701_scolarite_Antoine", je réponds "ECOLE_SUPERIEUR"
    Et à la question "0401_nationalite_Antoine", je réponds "fr"
    Et à la question "0407_typePermis_Antoine", je réponds "B" sans validation
    Et à la question "0408_complementPermisB_Antoine", je réponds "ETUDES" sans validation
    Et à la question "0409_dateArriveeSuisse_Antoine", je réponds "01.12.2018"
    # Et à la question "0409_dateArriveeSuisse_Antoine", je réponds 2 an 
    Et à la question "0501_domicileCantonGE_Antoine", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Antoine", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Antoine", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Antoine", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "2"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1101_assuranceMaladieSuisse_Antoine", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Antoine", je réponds "NON"
    Et à la question "1404_parentsHabiteFranceTravailleSuisse_Antoine", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES" est refusée
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible

  Scénario: 2 - Permis B étudiant, autre pays, habitant à GE depuis 2 ans, parents habitent Fr et père travaille à GE , travaille 10%, Colocation (3 avec lui dans 5 pièces), LaMAL, Taxation classique, pas de fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 22 ans et je m'appelle "Léon"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Léon", je réponds "OUI "
    Et à la question "0701_scolarite_Léon", je réponds "ECOLE_SUPERIEUR"
    Et à la question "0401_nationalite_Léon", je réponds "de"
    Et à la question "0407_typePermis_Léon", je réponds "B" sans validation
    Et à la question "0408_complementPermisB_Léon", je réponds "ETUDES" sans validation
    Et à la question "0409_dateArriveeSuisse_Léon", je réponds "03.12.2018"
    # Et à la question "0409_dateArriveeSuisse_Léon", je réponds 2 ans
    Et à la question "0501_domicileCantonGE_Léon", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Léon", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Léon", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Léon", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "2"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1101_assuranceMaladieSuisse_Léon", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Et à la question "1403_fonctionnaireInternational_Léon", je réponds "NON"
    Et à la question "1404_parentsHabiteFranceTravailleSuisse_Léon", je réponds "OUI"
    Alors la prestation "SUBSIDES_Léon" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Léon" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible
