import 'cypress-data-session'

const createFakeToken = () => {
  cy.api({
    method: 'GET',
    url: '/auth/fake-token'
  }).its('body.token')
}

const getFakeToken = (sessionName: string) => {
  cy.dataSession({
    name: sessionName,
    validate: (): true => true,
    setup: createFakeToken,
    shareAcrossSpecs: true
  })
}

Cypress.Commands.add('getFakeToken', getFakeToken)
