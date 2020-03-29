package ch.ge.social.qeli.api.formulaire.jaxb;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(propOrder = {"departementLigne1", "serviceLigne1"})
public class Expediteur {

  public Expediteur(){}

  public Expediteur(String aDepartementLligne1, String aServiceLigne1){
    this.departementLigne1 = aDepartementLligne1;
    this.serviceLigne1 = aServiceLigne1;
  }

  @XmlElement
  private String departementLigne1;

  @XmlElement
  private String serviceLigne1;
}

