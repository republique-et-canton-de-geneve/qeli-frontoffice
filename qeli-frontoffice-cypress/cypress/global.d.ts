declare namespace Cypress {
  interface ResolvedConfigOptions {
    /**
     * @description Simply hides any command log entries that originate from fetch/XHR requests.
     * @default false
     */
    hideXHRInCommandLog?: boolean;
  }
}
