package ch.ge.social.qeli.service.editique;

import ch.ge.cti.fwk.cmp.dialogue.outils.rapport.OutilsRapportDialogue;
import ch.ge.cti.fwk.cmp.dialogue.outils.rapport.Report;
import ch.ge.cti.fwk.cmp.dialogue.outils.rapport.ReportFormat;
import ch.ge.social.qeli.service.models.Rapport;
import ch.ge.social.qeli.serviceapi.PDFGenerationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.stereotype.Service;
import org.springframework.xml.transform.StringResult;
import outils.exception.CtiException;

@Service
public class EditiqueService {

  private final OutilsRapportDialogue outilsRapport;
  private final Jaxb2Marshaller       marshaller;

  @Autowired
  public EditiqueService(OutilsRapportDialogue outilsRapport,
                         @Qualifier("editiqueJaxbMarshaller") Jaxb2Marshaller marshaller) {
    this.outilsRapport = outilsRapport;
    this.marshaller = marshaller;
  }

  public byte[] generateDocument(Rapport rapport) {
    try {
      Report report = outilsRapport.createReport(toModel(rapport), toXmlString(rapport), ReportFormat.PDF);
      return report.getData();
    } catch (CtiException e) {
      throw new PDFGenerationException("Un problème est survenur lors de la géneration du rapport", e);
    }
  }

  private String toXmlString(Rapport rapport) {
    StringResult result = new StringResult();
    marshaller.marshal(rapport, result);
    return result.toString();
  }

  private String toModel(Rapport rapport) {
    return rapport.getDebutDocument()
                  .getDocument()
                  .getNomModele();
  }


}
