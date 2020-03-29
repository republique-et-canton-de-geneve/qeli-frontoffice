package ch.ge.social.qeli.api.formulaire.jaxb;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(propOrder = {"document", "metier"})
public class DebutDocument {

  public DebutDocument(){}

  public DebutDocument(Document aDocument, Metier aMetier){
    this.document = aDocument;
    this.metier = aMetier;
  }

  @XmlElement(name="DOCUMENT")
  private Document document;

  @XmlElement(name="METIER")
  private Metier metier;

}

