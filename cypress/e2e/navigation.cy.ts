describe('Navigation - protection without auth token', () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it('allows public auth routes', () => {
    cy.visit('/auth/sign-in');
    cy.location('pathname').should('eq', '/auth/sign-in');

    cy.visit('/auth/sign-up');
    cy.location('pathname').should('eq', '/auth/sign-up');
  });

  it('redirects protected routes to /auth/sign-up', () => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/auth/sign-up');

    cy.visit('/employee/1');
    cy.location('pathname').should('eq', '/auth/sign-up');

    cy.visit('/employee/1/edit');
    cy.location('pathname').should('eq', '/auth/sign-up');

    cy.visit('/new');
    cy.location('pathname').should('eq', '/auth/sign-up');
  });
});
