package ch.ge.social.qeli.service.models;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name="RAPPORT")
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(propOrder = {"debutDocument"})
public class Rapport {

    public Rapport(){}

    public Rapport(DebutDocument aDocument){
      this.debutDocument = aDocument;
    }

    @XmlElement(name="DEBUTDOCUMENT")
    private DebutDocument debutDocument;

    public DebutDocument getDebutDocument(){
      return debutDocument;
    }

}


