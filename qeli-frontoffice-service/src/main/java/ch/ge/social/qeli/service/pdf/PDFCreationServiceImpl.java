package ch.ge.social.qeli.service.pdf;

import ch.ge.social.qeli.service.api.pdf.PDFCreationService;
import ch.ge.social.qeli.service.api.pdf.PDFGenerationException;
import ch.ge.social.qeli.service.api.result.dto.Eligibilite;
import ch.ge.social.qeli.service.api.result.dto.EligibiliteRefusee;
import ch.ge.social.qeli.service.api.result.dto.QeliResult;
import ch.ge.social.qeli.service.common.MustacheTemplateLoader;
import ch.ge.social.qeli.service.editique.EditiqueClient;
import ch.ge.social.qeli.service.editique.EditiqueClientException;
import ch.ge.social.qeli.xml.edition.DebutDocumentType;
import ch.ge.social.qeli.xml.edition.DocumentType;
import ch.ge.social.qeli.xml.edition.ExpediteurType;
import ch.ge.social.qeli.xml.edition.MetierType;
import ch.ge.social.qeli.xml.edition.RapportType;
import com.samskivert.mustache.Template;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

/**
 * Une implementation du service de création de PDF qui utilise le service de l'éditique..
 */
@Service
public class PDFCreationServiceImpl implements PDFCreationService {

  private final EditiqueClient editiqueClient;
  private final Template       bodyTemplate;

  @Autowired
  public PDFCreationServiceImpl(EditiqueClient editiqueClient) {
    this.editiqueClient = editiqueClient;
    this.bodyTemplate =
      MustacheTemplateLoader.load(new ClassPathResource("mustache/pdf-recapitulatif-body-template.mustache"));
  }

  @Override
  public byte[] generate(QeliResult result) {
    RapportType rapport = new RapportType();
    rapport.setDEBUTDOCUMENT(createDebutDocument(result));

    try {
      return editiqueClient.generateDocument(rapport);
    } catch (EditiqueClientException exception) {
      throw new PDFGenerationException("Erreur lors de la génération du pdf", exception);
    }
  }

  private DebutDocumentType createDebutDocument(QeliResult result) {
    DebutDocumentType debutDocument = new DebutDocumentType();
    debutDocument.setDOCUMENT(createDocument());
    debutDocument.setMETIER(createMetier(result));
    return debutDocument;
  }

  private DocumentType createDocument() {
    DocumentType document = new DocumentType();
    document.setDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.YYYY")));
    document.setEXPEDITEUR(createExpediteur());
    document.setLieuCourrier("Genève");
    document.setNomModele("10818_QELI_001_RECAP_QUESTIONS_PS_V1_I");
    return document;
  }

  private ExpediteurType createExpediteur() {
    ExpediteurType expediteur = new ExpediteurType();
    expediteur.setDepartementLigne1("Département de la cohésion sociale");
    expediteur.setServiceLigne1("Centre de compétence du RDU");
    return expediteur;
  }

  private MetierType createMetier(QeliResult result) {
    MetierType metier = new MetierType();
    metier.setTexte1(bodyTemplate.execute(this.toBodyTemplateParameters(result)));
    return metier;
  }

  private BodyTemplateParameters toBodyTemplateParameters(QeliResult result) {
    return BodyTemplateParameters.builder()
                                 .prestationsDejaPercues(
                                   result.getEligibiliteRefusees().stream()
                                         .filter(EligibiliteRefusee::isDejaPercue)
                                         .map(EligibiliteRefusee::getEligibilite)
                                         .map(Eligibilite::getPrestation)
                                         .collect(Collectors.toList()))
                                 .prestationsRefusees(
                                   result.getEligibiliteRefusees().stream()
                                         .filter(eliligibiliteRefusee -> !eliligibiliteRefusee.isDejaPercue())
                                         .map(EligibiliteRefusee::getEligibilite)
                                         .map(Eligibilite::getPrestation)
                                         .collect(Collectors.toList()))
                                 .prestationsEligibles(
                                   result.getEligibilites().stream()
                                         .map(Eligibilite::getPrestation)
                                         .collect(Collectors.toList()))
                                 .build();
  }
}
