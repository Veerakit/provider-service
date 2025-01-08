import { retryableBefore } from 'cy-retryable-before'

describe('CRUD movie', () => {
  let authToken: string
  retryableBefore(() => {
    cy.api({ method: 'GET', url: '/' })
      .its('body.message')
      .should('eq', 'Server is running')

    cy.getFakeToken('token-session').then((token): void => {
      authToken = token
    })
  })

  it('should log auth token', () => {
    cy.wrap(authToken).should('be.a', 'string')
  })
})
