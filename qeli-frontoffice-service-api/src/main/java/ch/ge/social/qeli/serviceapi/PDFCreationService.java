package ch.ge.social.qeli.serviceapi;

import ch.ge.social.qeli.serviceapi.dto.Formulaire;

public interface PDFCreationService {

  byte[] generatePDF(Formulaire form);

}
