package ch.ge.social.qeli.service.api.i18n;

import ch.ge.social.qeli.service.api.i18n.dto.I18nString;
import ch.ge.social.qeli.service.api.result.dto.Prestation;
import ch.ge.social.qeli.service.api.result.dto.Result;

/**
 * Un service permettant de résoudre la traduction un objet de type {@link I18nString}.
 */
public interface I18nResolver {
  /**
   * Résout la traduction d'un objet de type {@link I18nString}.
   *
   * @param i18nString le string à traduire.
   *
   * @return la traduction.
   */
  String translate(I18nString i18nString);

  /**
   * Résout la traduction d'une clé i18n, équivalent à : {@code i18nService.translate(new I18nString(key))}.
   *
   * @param key la clé à traduire.
   *
   * @return la traduction.
   */
  String translate(String key);

  /**
   * Résout la traduction d'un résultat et sa prestation.
   *
   * @param prestation la prestation.
   * @param result     le résultat.
   *
   * @return le résultat traduit.
   */
  String translate(Prestation prestation, Result result);
}
