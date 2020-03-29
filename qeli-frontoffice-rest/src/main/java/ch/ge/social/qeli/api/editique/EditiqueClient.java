package ch.ge.social.qeli.api.editique;
/*
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.stereotype.Component;

@Component
public class EditiqueClient {
  private final OutilsRapportDialogue outilsRapport;
  private final Jaxb2Marshaller       marshaller;

  @Autowired
  public EditiqueClient(OutilsRapportDialogue outilsRapport,
                        @Qualifier("editiqueJaxbMarshaller") Jaxb2Marshaller marshaller) {
    this.outilsRapport = outilsRapport;
    this.marshaller = marshaller;
  }

  public byte[] generateDocument(RapportType rapport) {
    try {
      Report report = outilsRapport.createReport(toModel(rapport), toXmlString(rapport), ReportFormat.PDF);
      return report.getData();
    } catch (CtiException e) {
      throw new EditiqueClientException("Un problème est survenur lors de la géneration du rapport", e);
    }
  }

  private String toXmlString(RapportType rapportType) {
    StringResult result = new StringResult();
    marshaller.marshal(rapportType, result);
    return result.toString();
  }

  private String toModel(RapportType rapport) {
    return rapport.getDEBUTDOCUMENT()
                  .getDOCUMENT()
                  .getNomModele();
  }




}
*/
