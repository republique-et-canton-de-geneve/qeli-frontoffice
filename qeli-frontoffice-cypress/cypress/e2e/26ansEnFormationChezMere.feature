# language: fr
Fonctionnalité: Jeune de 26 ans en formation, chez ses parents
  On teste le cas d'un jeune de 22 ans en formation vivant chez ses parents

  Scénario: 6 - Jeune de 26 ans en formation, chez sa mère et fratrie, doctorat, fratrie au collège, Subsides, Suisse, habitant à Genève depuis la naissance, travaille 20%, Pas sur le bail, assurance maladie LaMAL, pension pas payée par le père, Taxation classique, pas de fortune
    Etant donné que je suis sur le formulaire
    Et que je suis "CELIBATAIRE", j'ai 26 ans et je m'appelle "Léon"
    Et que je passe à la question suivante
    Quand à la question "0101_prestations", je coche "SUBSIDES_Léon"
    Et à la question "0702_formation_Léon", je réponds "OUI "
    Et à la question "0701_scolarite_Léon", je réponds "UNIVERSITE_DOCTORAT"
    Et à la question "0401_nationalite_Léon", je réponds "ch"
    Et à la question "0501_domicileCantonGE_Léon", je réponds "OUI" sans validation
    Et à la question "0502_dateArriveeGeneve_Léon", je réponds "DEPUIS_NAISSANCE"
    Et à la question "0601_revenus_Léon", je réponds "EMPLOI" sans validation
    Et à la question "0602_situationRente_Léon", je réponds "NON"
    Et à la question "1001_proprietaireOuLocataireLogement", je réponds "LOCATAIRE_SOUS_LOCATAIRE"
    Et à la question "1002_bailLogementAVotreNom", je réponds "NON"
    Et à la question "1201_droitPensionAlimentaire", je réponds "OUI"
    Et à la question "1202_recoisEntierementPensionAlimentaire", je réponds "NON"
    Et à la question "1302_fortuneSuperieureA", je réponds "NON"
    Alors la prestation "SUBSIDES" est déjà perçue
    Alors la prestation "AVANCES" est éligible
    Alors la prestation "ALLOCATION_LOGEMENT" est refusée
    Alors la prestation "PC_AVS_AI" est refusée
    Alors la prestation "BOURSES_Léon" est refusée
    Alors la prestation "PC_FAM" est refusée
    Alors la prestation "AIDE_SOCIALE" est éligible
