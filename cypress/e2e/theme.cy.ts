describe('Theme mode toggle and persistence', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('switches to dark mode and persists after reload', () => {
    cy.visit('/auth/sign-in');

    // Open the theme select and choose Dark
    cy.get('[data-screenshot="toggle-mode"]').click();
    cy.contains('li', 'Dark').click();

    // Assert HTML attribute and localStorage set (retryable)
    cy.document()
      .its('documentElement')
      .invoke('getAttribute', 'data-mui-color-scheme')
      .should('eq', 'dark');
    cy.window().its('localStorage.mui-mode').should('eq', 'dark');

    // Reload and verify persistence
    cy.reload();
    cy.document()
      .its('documentElement')
      .invoke('getAttribute', 'data-mui-color-scheme')
      .should('eq', 'dark');
    cy.window().its('localStorage.mui-mode').should('eq', 'dark');
  });

  it('switches back to light mode and persists', () => {
    cy.visit('/auth/sign-in');

    cy.get('[data-screenshot="toggle-mode"]').click();
    cy.contains('li', 'Light').click();

    cy.document()
      .its('documentElement')
      .invoke('getAttribute', 'data-mui-color-scheme')
      .should('eq', 'light');
    cy.window().its('localStorage.mui-mode').should('eq', 'light');

    cy.reload();
    cy.document()
      .its('documentElement')
      .invoke('getAttribute', 'data-mui-color-scheme')
      .should('eq', 'light');
    cy.window().its('localStorage.mui-mode').should('eq', 'light');
  });
});


