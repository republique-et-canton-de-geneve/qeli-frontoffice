package ch.ge.social.qeli.service.stats;


/**
 * Status des eligibilites.
 */
public enum ReponseStatus {
  ELIGIBLE("Eligible"),
  REFUSE("Refuse"),
  DEJA_PERCUE("Déjà perçue");

  public final String value;

  private ReponseStatus(String value) {
    this.value = value;
  }
}
