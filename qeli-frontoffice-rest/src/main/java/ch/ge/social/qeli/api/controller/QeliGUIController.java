package ch.ge.social.qeli.api.controller;

import ch.ge.social.qeli.api.formulaire.Formulaire;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.file.Files;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class QeliGUIController {

  @Value("classpath:hbt.pdf")
  Resource src;

  @PutMapping(value = "/pdf")
  byte[] generatePDF() throws IOException {

    String param = "{\"answers\":[{\"question\":\"prestations\",\"answer\":\"AUCUNE\"}," +
                   "{\"question\":\"dateNaissance\",\"answer\":\"2020-03-05\"},{\"question\":\"etatCivil\"," +
                   "\"answer\":\"CELIBATAIRE\"},{\"question\":\"enfantsACharge\",\"answer\":\"AUCUN\"}," +
                   "{\"question\":\"concubinageAutreParent\"},{\"question\":\"nationalite\",\"answer\":\"APATRIDE\"}," +
                   "{\"question\":\"refugie\"},{\"question\":\"nationaliteConjoint\"}," +
                   "{\"question\":\"refugieConjoint\"},{\"question\":\"permisBEtudes\"}," +
                   "{\"question\":\"domicileCantonGE\",\"answer\":\"NON\"},{\"question\":\"dateArriveeGeneve\"}," +
                   "{\"question\":\"residenceEffectiveCantonGE\"},{\"question\":\"dateArriveeSuisse\"," +
                   "\"answer\":\"INCONNU\"},{\"question\":\"dateArriveeSuisseConjoint\"},{\"question\":\"revenus\"," +
                   "\"answer\":\"AUCUNE\"},{\"question\":\"situationRente\",\"answer\":\"RECONNU_OCAI\"}," +
                   "{\"question\":\"revenusConjoint\"},{\"question\":\"situationRenteConjoint\"}," +
                   "{\"question\":\"revenusConcubin\"},{\"question\":\"revenusEnfant\"}," +
                   "{\"question\":\"situationRenteEnfant\"},{\"question\":\"enFormation\",\"answer\":\"NON\"}," +
                   "{\"question\":\"scolarite\"},{\"question\":\"taxationOffice\"},{\"question\":\"tauxActivite\"}," +
                   "{\"question\":\"tauxActiviteDernierEmploi\"},{\"question\":\"tauxActiviteVariable6DernierMois\"}," +
                   "{\"question\":\"tauxActiviteMoyen6DernierMois\"},{\"question\":\"tauxActiviteConjoint\"}," +
                   "{\"question\":\"tauxActiviteDernierEmploiConjoint\"}," +
                   "{\"question\":\"tauxActiviteVariable6DernierMoisConjoint\"}," +
                   "{\"question\":\"tauxActiviteMoyen6DernierMoisConjoint\"}," +
                   "{\"question\":\"proprietaireOuLocataireLogement\"},{\"question\":\"bailLogementAVotreNom\"}," +
                   "{\"question\":\"nombreDePersonnesLogement\"},{\"question\":\"nombreDePiecesLogement\"}," +
                   "{\"question\":\"appartementHabitationMixte\"},{\"question\":\"montantLoyerFixeOuVariable\"}," +
                   "{\"question\":\"assuranceMaladieSuisse\",\"answer\":\"NON\"}," +
                   "{\"question\":\"droitPensionAlimentaire\"}," +
                   "{\"question\":\"recoisEntierementPensionAlimentaire\"},{\"question\":\"fortuneSuperieureA\"}," +
                   "{\"question\":\"impotFortune\"},{\"question\":\"exempteImpot\"},{\"question\":\"taxeOfficeAFC\"}," +
                   "{\"question\":\"fonctionnaireInternational\"}," +
                   "{\"question\":\"parentsHabiteFranceTravailleSuisse\"}],\"prestationEligible\":[\"PC_AVS_AI\"]," +
                   "\"prestationDejaPercues\":[],\"prestationRefusees\":[{\"prestation\":\"AIDE_SOCIALE\"," +
                   "\"questionKeys\":[\"dateNaissance\"]},{\"prestation\":\"PC_FAM\"," +
                   "\"questionKeys\":[\"enfantsACharge\"]},{\"prestation\":\"AVANCES\"," +
                   "\"questionKeys\":[\"domicileCantonGE\"]},{\"prestation\":\"ALLOCATION_LOGEMENT\"," +
                   "\"questionKeys\":[\"domicileCantonGE\"]},{\"prestation\":\"BOURSES\"," +
                   "\"questionKeys\":[\"enFormation\"]},{\"prestation\":\"SUBSIDES\"," +
                   "\"questionKeys\":[\"assuranceMaladieSuisse\"]}]}";


    ObjectMapper mapper = new ObjectMapper();
    Formulaire form = mapper.readValue(param, Formulaire.class);
    System.out.println(form);

    return Files.readAllBytes(src.getFile().toPath());
  }

}
