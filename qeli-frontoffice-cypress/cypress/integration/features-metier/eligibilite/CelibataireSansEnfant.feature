# language: fr
Fonctionnalité: Céibataire sans enfant
  On teste les cas de célibataire sans enfant

  Scénario: 10 - célibataire, pas d'enfant, Français, permis C, habitant à Genève depuis 2 ans, Travaille 100%, Propritaire, assurance maladie LaMAL, Taxé d'office, pas de fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 41 ans et je m'appelle "Rémi"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Rémi", je réponds "NON"
    Et à la question "0401_nationalite_Rémi", je réponds "fr"
    Et à la question "0407_typePermis_Rémi", je réponds "C" sans validation
    Et à la question "0408_complementPermisC_Rémi", je réponds "UE_AELE" sans validation
    Et à la question "0409_dateArriveeSuisse_Rémi", je réponds "04.12.2018"
    # Et à la question "0409_dateArriveeSuisse_Rémi", je réponds 2 ans
    Et à la question "0501_domicileCantonGE_Rémi", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Rémi", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Rémi", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Rémi", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "PROPRIETAIRE"
    Et à la question "1101_assuranceMaladieSuisse_Rémi", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES" est refusée

  Scénario: 28 - célibataire, pas d'enfant, subsides, suisse, à Genève depuis la naissance, Retraité avec rente , Locataire 4 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 66 ans et je m'appelle "Brigitte"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "SUBSIDES_Brigitte"
    Et à la question "0702_formation_Brigitte", je réponds "NON"
    Et à la question "0401_nationalite_Brigitte", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Brigitte", je réponds "OUI"
    Et à la question "0502_dateArriveeGeneve_Brigitte", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Brigitte", je réponds "AVS_RETRAITE"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "4"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est refusée
    Alors la prestation "PC_AVS_AI" est éligible
    Alors la prestation "BOURSES" est refusée


  Scénario: 31 - veuf, pas d'enfant, subsides, suisse, à Genève depuis la naissance, Retraité avec rente , Locataire 3 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "VEUF", j'ai 98 ans et je m'appelle "Marthe"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "SUBSIDES_Marthe"
    Et à la question "0702_formation_Marthe", je réponds "NON"
    Et à la question "0401_nationalite_Marthe", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Marthe", je réponds "OUI"
    Et à la question "0502_dateArriveeGeneve_Marthe", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Marthe", je réponds "AVS_RETRAITE" 
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "3"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1301_impotFortune", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est refusée
    Alors la prestation "PC_AVS_AI" est éligible
    Alors la prestation "BOURSES" est refusée

  Scénario: 33 - veuf, pas d'enfant, subsides, suisse, à Genève depuis la naissance, Retraité avec rente , Locataire 3 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "VEUF", j'ai 98 ans et je m'appelle "Simone"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "SUBSIDES_Simone"
    Et à la question "0702_formation_Simone", je réponds "NON"
    Et à la question "0401_nationalite_Simone", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Simone", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Simone", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Simone", je réponds "NON" sans validation
    Et à la question "0602_situationRente_Simone", je réponds "RETRAITE_SANS_RENTE"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "3"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "OUI"
    Et à la question "1301_impotFortune", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est refusée
    Alors la prestation "PC_AVS_AI" est éligible
    Alors la prestation "BOURSES" est refusée

  Scénario: 34 - célibataire, suisse, à Genève depuis la naissance, AI avec rente , Locataire 4 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 74 ans et je m'appelle "Hermine"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "NON"
    Et à la question "0702_formation_Hermine", je réponds "NON"
    Et à la question "0401_nationalite_Hermine", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Hermine", je réponds "OUI"
    Et à la question "0502_dateArriveeGeneve_Hermine", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Hermine", je réponds "AI_INVALIDITE" 
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "4"
    Et à la question "1101_assuranceMaladieSuisse_Hermine", je réponds "OUI"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1401_exempteImpot", je réponds "NON"
    Alors la prestation "SUBSIDES" est éligible
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est refusée
    Alors la prestation "PC_AVS_AI" est éligible
    Alors la prestation "BOURSES" est refusée

  Scénario: 37 - célibataire, subsides, suisse, à Genève depuis la naissance, AI 50% sans rente, Locataire 3 pièces, assurance maladie LaMAL, Taxation classique, fortune 5'000.-
    Etant donné que je suis sur le formulaire
    Et que je suis "VEUF", j'ai 78 ans et je m'appelle "Suzanne"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "SUBSIDES_Suzanne"
    Et à la question "0702_formation_Suzanne", je réponds "NON"
    Et à la question "0401_nationalite_Suzanne", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Suzanne", je réponds "OUI"
    Et à la question "0502_dateArriveeGeneve_Suzanne", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Suzanne", je réponds "AI_INVALIDITE" 
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "OUI"
    Et à la question "1004_nombreDePiecesLogement", je réponds "3"
    Et à la question "1006_montantLoyerFixeOuVariable", je réponds "FIXE"
    Et à la question "1201_droitPensionAlimentaire", je réponds "NON"
    Et à la question "1301_impotFortune", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est refusée
    Alors la prestation "ALLOCATION_LOGEMENT" est éligible
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est refusée
    Alors la prestation "PC_AVS_AI" est éligible
    Alors la prestation "BOURSES" est refusée
