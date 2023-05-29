describe('Check part value', () => {
  beforeEach(() => {
    cy.visit('/#/login');
    cy.get('[data-cy="username-input"]').type(Cypress.env('username'));
    cy.get('[data-cy="password-input"]').type(Cypress.env('user_password'));
    cy.get('[data-cy="login-btn"]').click();
    cy.visit('/#/parts/version/1/info');
  });
  it('.should() - have correct number', () => {
    cy.get('[data-cy="info-part-number"]').find('input').should('have.value', 'P01-000001');
  });
});
