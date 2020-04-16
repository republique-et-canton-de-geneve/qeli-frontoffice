/**
 * Un modèle représentant un string à traduire.
 */
export interface I18nString {
  /**
   * La clé de traduction.
   */
  key: string;

  /**
   * Optionnellement, des paramètres de traduction.
   */
  parameters?: { [key: string]: string | number | Date };
}
