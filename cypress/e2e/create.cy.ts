describe('Create Page - New Employee', () => {
  beforeEach(() => {
    // bypass auth protection
    cy.setCookie('auth_token', 'e2e_token');
  });

  it('shows validation errors on empty submit', () => {
    cy.visit('/new');

    cy.get('#employee-submit').click();

    cy.get('#first_name').parents('.MuiFormControl-root').find('.MuiFormHelperText-root').should('contain.text', 'This field is required');
    cy.get('#last_name').parents('.MuiFormControl-root').find('.MuiFormHelperText-root').should('contain.text', 'This field is required');
    cy.get('#email').parents('.MuiFormControl-root').find('.MuiFormHelperText-root').should('contain.text', 'This field is required');
  });

  it('creates a new employee successfully and redirects to /', () => {
    cy.intercept('POST', 'https://reqres.in/api/users', {
      statusCode: 201,
      body: { id: 999 },
    }).as('createUser');

    cy.visit('/new');
    cy.get('#first_name').type('George');
    cy.get('#last_name').type('Bluth');
    cy.get('#email').type('george.bluth@reqres.in');
    cy.get('#employee-submit').click();

    cy.wait('@createUser');
    cy.location('pathname').should('eq', '/');
  });

  it('shows error toast when creation fails', () => {
    cy.intercept('POST', 'https://reqres.in/api/users', {
      statusCode: 400,
      body: { error: 'creation failed' },
    }).as('createUserFail');

    cy.visit('/new');
    cy.get('#first_name').type('George');
    cy.get('#last_name').type('Bluth');
    cy.get('#email').type('george.bluth@reqres.in');
    cy.get('#employee-submit').click();

    cy.wait('@createUserFail');
    cy.contains(/creation failed/i).should('be.visible');
  });

  it('Back button navigates to /', () => {
    cy.visit('/new');
    cy.get('#employee-back').click();
    cy.location('pathname').should('eq', '/');
  });
});


