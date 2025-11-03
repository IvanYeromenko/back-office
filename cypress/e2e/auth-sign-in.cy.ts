describe('Auth - Sign In', () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it('shows validation errors on empty submit', () => {
    cy.visit('/auth/sign-in');

    cy.get('#sign-in-submit').click();

    cy.get('#email').parents('.MuiFormControl-root').find('.MuiFormHelperText-root').should('contain.text', 'This field is required');
    cy.get('#password').parents('.MuiFormControl-root').find('.MuiFormHelperText-root').should('contain.text', 'This field is required');
  });

  it('signs in successfully and redirects to /', () => {
    cy.intercept('POST', 'https://reqres.in/api/login', {
      statusCode: 200,
      body: { token: 'fake_token_123' },
    }).as('login');

    cy.visit('/auth/sign-in');

    cy.get('#email').type('george.bluth@reqres.in');
    cy.get('#password').type('cityslicka');
    cy.get('#sign-in-submit').click();

    cy.wait('@login');

    // token cookie should be set by app logic
    cy.getCookie('auth_token').should('have.property', 'value', 'fake_token_123');

    // redirected to dashboard
    cy.location('pathname').should('eq', '/');
  });

  it('shows server error toast on invalid credentials', () => {
    cy.intercept('POST', 'https://reqres.in/api/login', {
      statusCode: 400,
      body: { error: 'user not found' },
    }).as('loginFail');

    cy.visit('/auth/sign-in');
    cy.get('#email').type('george.bluth@reqres.in');
    cy.get('#password').type('cityslicka');
    cy.get('#sign-in-submit').click();

    cy.wait('@loginFail');

    // The app uses notifications provider; assert error toast appears
    cy.contains(/user not found/i).should('be.visible');
  });

  it('navigates from sign-in to sign-up via link', () => {
    cy.visit('/auth/sign-in');
    cy.get('#go-to-sign-up').click();
    cy.location('pathname').should('eq', '/auth/sign-up');
  });
});


