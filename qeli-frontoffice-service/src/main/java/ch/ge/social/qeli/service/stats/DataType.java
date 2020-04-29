package ch.ge.social.qeli.service.stats;


/**
 *  Type de des données
 */
public enum DataType {
  REPONSE("Reponse"),
  RESULTAT("Resultat");

  public final String value;

  private DataType(String value) {
    this.value = value;
  }
}
