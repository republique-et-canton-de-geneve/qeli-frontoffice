package ch.ge.social.qeli.service.stats;


/**
 * Une implementation du service de stats, les données provenant du formulaire sont ajoutées à un log journal au format
 * csv.
 */
public enum DataType {
  REPONSE("Reponse"),
  RESULTAT("Resultat");

  public final String value;

  private DataType(String value) {
    this.value = value;
  }
}
