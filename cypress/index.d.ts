export {}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * if fake token is not exist create a new one
       * if fake token exists reuse it
       */
      getFakeToken(sessionName: string): Chainable<string>

      /** https://www.npmjs.com/package/@cypress/skip-test
       * `cy.skipOn('localhost')` */
      skipOn(
        nameOrFlag: string | boolean | (() => boolean),
        cb?: () => void
      ): Chainable<Subject>

      /** https://www.npmjs.com/package/@cypress/skip-test
       * `cy.onlyOn('localhost')` */
      onlyOn(
        nameOrFlag: string | boolean | (() => boolean),
        cb?: () => void
      ): Chainable<Subject>
    }
  }
}
