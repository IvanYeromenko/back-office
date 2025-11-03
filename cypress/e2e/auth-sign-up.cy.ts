describe('Auth - Sign Up', () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it('shows validation errors on empty submit', () => {
    cy.visit('/auth/sign-up');

    cy.get('#sign-up-submit').click();

    cy.get('#name').parents('.MuiFormControl-root').find('.MuiFormHelperText-root').should('contain.text', 'This field is required');
    cy.get('#email').parents('.MuiFormControl-root').find('.MuiFormHelperText-root').should('contain.text', 'This field is required');
    cy.get('#password').parents('.MuiFormControl-root').find('.MuiFormHelperText-root').should('contain.text', 'This field is required');
    cy.get('#confirmPassword').parents('.MuiFormControl-root').find('.MuiFormHelperText-root').should('contain.text', 'This field is required');
  });

  it('signs up successfully and redirects to /', () => {
    cy.intercept('POST', 'https://reqres.in/api/register', {
      statusCode: 200,
      body: { token: 'new_user_token_456' },
    }).as('register');

    cy.visit('/auth/sign-up');

    cy.get('#name').type('George');
    cy.get('#email').type('george.bluth@reqres.in');
    cy.get('#password').type('cityslicka');
    cy.get('#confirmPassword').type('cityslicka');
    cy.get('#sign-up-submit').click();

    cy.wait('@register');

    cy.getCookie('auth_token').should('have.property', 'value', 'new_user_token_456');
    cy.location('pathname').should('eq', '/');
  });

  it('shows server error toast on failed registration', () => {
    cy.intercept('POST', 'https://reqres.in/api/register', {
      statusCode: 400,
      body: { error: 'registration failed' },
    }).as('registerFail');

    cy.visit('/auth/sign-up');
    cy.get('#name').type('George');
    cy.get('#email').type('george.bluth@reqres.in');
    cy.get('#password').type('cityslicka');
    cy.get('#confirmPassword').type('cityslicka');
    cy.get('#sign-up-submit').click();

    cy.wait('@registerFail');
    cy.contains(/registration failed/i).should('be.visible');
  });

  it('navigates from sign-up to sign-in via link', () => {
    cy.visit('/auth/sign-up');
    cy.get('#go-to-sign-in').click();
    cy.location('pathname').should('eq', '/auth/sign-in');
  });
});


