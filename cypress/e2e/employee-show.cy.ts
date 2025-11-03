describe('Employee Show Page', () => {
  beforeEach(() => {
    cy.setCookie('auth_token', 'e2e_token');
  });

  const user = {
    id: 1,
    email: 'george.bluth@reqres.in',
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://example.com/avatar/1.png',
  };

  it('renders user details and supports navigation/actions', () => {
    cy.intercept('GET', 'https://reqres.in/api/users/1', {
      statusCode: 200,
      body: { data: user },
    }).as('getUser');

    cy.visit('/employee/1');
    cy.wait('@getUser');

    cy.contains('First Name').should('be.visible');
    cy.contains('George').should('be.visible');
    cy.contains('Last Name').should('be.visible');
    cy.contains('Bluth').should('be.visible');
    cy.contains('Email').should('be.visible');
    cy.contains('george.bluth@reqres.in').should('be.visible');

    // Edit button navigates to edit page
    cy.get('#employee-edit').click();
    cy.location('pathname').should('eq', '/employee/1/edit');

    // Back to show
    cy.visit('/employee/1');
    cy.wait('@getUser');

    // Back navigates to dashboard
    cy.get('#employee-back').click();
    cy.location('pathname').should('eq', '/');

    // Back to show to test delete
    cy.intercept('GET', 'https://reqres.in/api/users/1', {
      statusCode: 200,
      body: { data: user },
    }).as('getUserAgain');
    cy.visit('/employee/1');
    cy.wait('@getUserAgain');

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });
    cy.intercept('DELETE', 'https://reqres.in/api/users/1', {
      statusCode: 204,
      body: {},
    }).as('deleteUser');
    cy.get('#employee-delete').click();
    cy.wait('@deleteUser');
    cy.location('pathname').should('eq', '/');
  });

  it('shows error state on fetch failure', () => {
    cy.intercept('GET', 'https://reqres.in/api/users/1', {
      statusCode: 500,
      body: { error: 'server error' },
    }).as('getUserFail');

    cy.visit('/employee/1');
    cy.wait('@getUserFail');
    cy.contains('.MuiAlert-message', /server error/i).should('be.visible');
  });
});


