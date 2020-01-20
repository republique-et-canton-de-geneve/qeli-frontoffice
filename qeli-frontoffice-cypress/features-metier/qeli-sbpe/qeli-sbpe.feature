Feature: Eligibilité au SBPE
  On teste les conditions d'éligibilité au SBPE

  Scenario: Eligibilité au SBPE possible
    Given Je me connecte au formulaire
    Then Je vois la question "0101_prestations" "Touchez-vous déjà une ou plusieurs prestations sociales ?"

    When A la question "0101_prestations", je réponds "subsides"
    Then Je vois la question "0201_dateNaissance" "Quelle est votre date de naissance ?"

    When A la question "0201_dateNaissance", je réponds "1977-11-01"
    Then Je vois la question "0301_etatCivil" "Quel est votre état civil ?"

    When A la question "0301_etatCivil", je réponds "marie"
    Then Je vois la question "0401_nationalite" "Quelle est votre nationalité ?"

    When A la question "0401_nationalite", je réponds "ch"
    Then La prestation "SBPE" est "possible"


  Scenario: Eligibilité au SBPE impossible en raison de l'age
    Given Je me connecte au formulaire
    Then Je vois la question "0101_prestations" "Touchez-vous déjà une ou plusieurs prestations sociales ?"

    When A la question "0101_prestations", je réponds "subsides"
    Then Je vois la question "0201_dateNaissance" "Quelle est votre date de naissance ?"

    When A la question "0201_dateNaissance", je réponds "1977-11-01"
    Then Je vois la question "0301_etatCivil" "Quel est votre état civil ?"

    When A la question "0301_etatCivil", je réponds "marie"
    Then Je vois la question "0401_nationalite" "Quelle est votre nationalité ?"

    When A la question "0401_nationalite", je réponds "ch"
    Then La prestation "SBPE" est "impossible"
