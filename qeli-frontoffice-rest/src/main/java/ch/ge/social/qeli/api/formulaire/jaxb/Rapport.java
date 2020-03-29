package ch.ge.social.qeli.api.formulaire.jaxb;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlMimeType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import lombok.Getter;

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

}


