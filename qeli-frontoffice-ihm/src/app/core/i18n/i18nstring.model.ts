/**
 * Un modèle représentant un string à traduire.
 */
export interface I18nString {
  /**
   * La clé de traduction.
   */
  key: string;

  // TODO could be a function as well
  /**
   * Optionnellement, des paramètres de traduction.
   */
  parameters?: { [key: string]: string | number | Date };
}
