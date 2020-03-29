package ch.ge.social.qeli.api.formulaire.jaxb;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(propOrder = {"texte1"})
public class Metier {

  public Metier(){}

  public Metier(String aText1){
    this.texte1 = aText1;
  }

  @XmlElement
  private String texte1;

}
