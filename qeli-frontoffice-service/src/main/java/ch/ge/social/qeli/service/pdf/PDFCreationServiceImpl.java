/*
 * qeli-frontoffice
 *
 * Copyright (C) 2019-2021 Republique et canton de Geneve
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package ch.ge.social.qeli.service.pdf;

import ch.ge.social.qeli.editique.EditiqueClient;
import ch.ge.social.qeli.editique.EditiqueClientException;
import ch.ge.social.qeli.service.api.pdf.PDFCreationService;
import ch.ge.social.qeli.service.api.pdf.PDFGenerationException;
import ch.ge.social.qeli.service.api.result.dto.QeliResult;
import ch.ge.social.qeli.service.common.VelocityTemplateLoader;
import ch.ge.social.qeli.xml.edition.DebutDocumentType;
import ch.ge.social.qeli.xml.edition.DocumentType;
import ch.ge.social.qeli.xml.edition.ExpediteurType;
import ch.ge.social.qeli.xml.edition.MetierType;
import ch.ge.social.qeli.xml.edition.RapportType;
import java.io.StringWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Une implementation du service de création de PDF qui utilise le service de l'éditique..
 */
@Service
public class PDFCreationServiceImpl implements PDFCreationService {

  private final EditiqueClient                 editiqueClient;
  private final PDFRecapitulatifContextBuilder pdfRecapitulatifContextBuilder;
  private final Template                       pdfRecapitulatifTemplate;

  @Autowired
  public PDFCreationServiceImpl(EditiqueClient editiqueClient,
                                PDFRecapitulatifContextBuilder pdfRecapitulatifContextBuilder,
                                VelocityTemplateLoader velocityTemplateLoader) {
    this.editiqueClient = editiqueClient;
    this.pdfRecapitulatifContextBuilder = pdfRecapitulatifContextBuilder;
    this.pdfRecapitulatifTemplate = velocityTemplateLoader.load("pdf-recapitulatif-body-template.vm");
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

  private MetierType createMetier(QeliResult qeliResult) {
    MetierType metier = new MetierType();
    VelocityContext context = pdfRecapitulatifContextBuilder.createContext(qeliResult.getResult());

    StringWriter writer = new StringWriter();
    pdfRecapitulatifTemplate.merge(context, writer);
    metier.setTexte1(writer.toString());

    return metier;
  }
}
