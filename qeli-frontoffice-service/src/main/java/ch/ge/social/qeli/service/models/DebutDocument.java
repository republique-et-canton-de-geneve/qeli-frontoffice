package ch.ge.social.qeli.service.models;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import lombok.Getter;
import lombok.Setter;

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

  public Document getDocument(){
    return document;
  }


}

