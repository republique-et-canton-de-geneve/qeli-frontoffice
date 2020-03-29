package ch.ge.social.qeli.api.formulaire.jaxb;


import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(propOrder = {"nomModele", "date", "lieuCourrier","expediteur" })
public class Document {

  public Document(){}

  public Document(String aNomModel, String aDate, String aLieuCourrier, Expediteur aExpediteur){
    this.nomModele = aNomModel;
    this.date = aDate;
    this.lieuCourrier = aLieuCourrier;
    this.expediteur = aExpediteur;
  }

  @XmlElement
  private String nomModele;

  @XmlElement
  private String date;

  @XmlElement
  private String lieuCourrier;

  @XmlElement(name="EXPEDITEUR")
  private Expediteur expediteur;

}

