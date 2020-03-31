package ch.ge.social.qeli.service;

import ch.ge.social.qeli.service.editique.EditiqueService;
import ch.ge.social.qeli.service.models.DebutDocument;
import ch.ge.social.qeli.service.models.Document;
import ch.ge.social.qeli.service.models.Expediteur;
import ch.ge.social.qeli.service.models.Metier;
import ch.ge.social.qeli.service.models.Rapport;
import ch.ge.social.qeli.serviceapi.DataFormatterService;
import ch.ge.social.qeli.serviceapi.PDFCreationService;
import ch.ge.social.qeli.serviceapi.PDFGenerationException;
import ch.ge.social.qeli.serviceapi.dto.Formulaire;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PDFCreationServiceImpl implements PDFCreationService {

  private final EditiqueService editiqueService;

  private final DataFormatterService formatterService;

  @Autowired
  public PDFCreationServiceImpl(DataFormatterService formatterService,
                                EditiqueService editiqueService) {
    this.formatterService = formatterService;;
    this.editiqueService = editiqueService;
  }

  @Override
  public byte[] generatePDF(Formulaire form) {

    String formattedContent = null;
    try {
      formattedContent = this.formatterService.formatData(form);
    } catch (IOException e) {
      throw new PDFGenerationException("Erreur lors de la génération du pdf", e);
    }

    Expediteur exp = new Expediteur("Departement de la cohésion sociale", "Centre de compétence du RDU");
    Metier metier = new Metier(formattedContent);
    Document doc = new Document("10818_QELI_001_RECAP_QUESTIONS_PS_V1_I",
                                LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.YYYY")), "Genève", exp);
    DebutDocument dd = new DebutDocument(doc, metier);
    Rapport rapport = new Rapport(dd);

    return editiqueService.generateDocument(rapport);

  }


}
