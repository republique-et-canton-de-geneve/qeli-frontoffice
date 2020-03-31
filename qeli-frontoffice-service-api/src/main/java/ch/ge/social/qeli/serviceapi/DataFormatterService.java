package ch.ge.social.qeli.serviceapi;

import ch.ge.social.qeli.serviceapi.dto.Formulaire;
import java.io.IOException;

public interface DataFormatterService {

  public String formatData(Formulaire form) throws IOException;

}
