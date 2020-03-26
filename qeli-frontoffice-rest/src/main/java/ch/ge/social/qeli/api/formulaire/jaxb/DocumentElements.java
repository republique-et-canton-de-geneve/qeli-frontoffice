package ch.ge.social.qeli.api.formulaire.jaxb;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

public class DocumentElements {

  @XmlRootElement(name="RAPPORT")
  public class RAPPORT {

    @XmlRootElement(name="DEBUTDOCUMENT")
    @XmlAccessorType(XmlAccessType.FIELD)
    public class DEBUTDOCUMENT {

      @XmlRootElement(name="DOCUMENT")
      @XmlAccessorType(XmlAccessType.FIELD)
      public class DOCUMENT {

        @XmlElement
        String nomModele;

        @XmlElement
        String date;

        @XmlElement
        String lieuCourrier;

        @XmlRootElement(name="EXPEDITEUR")
        @XmlAccessorType(XmlAccessType.FIELD)
        public class EXPEDITEUR {

          @XmlElement
          String departementLigne1;

          @XmlElement
          String serviceLigne1;

        }

      }

      @XmlRootElement(name="METIER")
      public class METIER {

        @XmlElement
        String texte1;

      }
    }

  }

}

