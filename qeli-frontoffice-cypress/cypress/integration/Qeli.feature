Feature: Eligible à une bourse
  Un étudiant qui n'a pas déjà cette prestation est éligible à une bourse

  Scenario: Je suis étudiant sans prestation bourse, donc éligible à cette prestation
    Given Je me connecte au formulaire
    Then Je vois la question "0101_prestations" "Touchez-vous déjà une ou plusieurs prestations sociales ?"

    Given A la question "0101_prestations", je réponds "subsides"
    Then Je vois la question "0201_dateNaissance" "Quelle est votre date de naissance ?"

    Given A la question "0201_dateNaissance", je réponds "1977-11-01"
    Then Je vois la question "0301_etatCivil" "Quel est votre état civil ?"

    Given A la question "0301_etatCivil", je réponds "marie"
    #Then Je vois la question "0401_nationalite" "Quelle est votre nationalité ?"
    Then Je vois la prestation eligible

  Scenario: J'ai déjà une bourse, donc non éligible à cette prestation
    Given Je me connecte au formulaire
    Then Je vois la question "0101_prestations" "Touchez-vous déjà une ou plusieurs prestations sociales ?"

    Given A la question "0101_prestations", je réponds "bourses"
    #Then Je vois la prestation "bourses" "non" eligible"
    Then Je vois la question "0201_dateNaissance" "Quelle est votre date de naissance ?"

    Given A la question "0201_dateNaissance", je réponds "1977-11-01"
    Then Je vois la question "0301_etatCivil" "Quel est votre état civil ?"

    Given A la question "0301_etatCivil", je réponds "marie"
    Then Je vois la prestation eligible

  Scenario: J'ai déjà une bourse, donc non éligible à cette prestation
    Given Je me connecte au formulaire
    Then Je vois la question "0101_prestations" "Touchez-vous déjà une ou plusieurs prestations sociales ?"

    Given A la question "0101_prestations", je réponds "bourses,avances"
    Then Je vois la question "0201_dateNaissance" "Quelle est votre date de naissance ?"

    Given A la question "0201_dateNaissance", je réponds "1977-11-01"
    Then Je vois la question "0301_etatCivil" "Quel est votre état civil ?"

    Given A la question "0301_etatCivil", je réponds "marie"
    Then Je vois la prestation eligible

