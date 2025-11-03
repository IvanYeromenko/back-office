describe('Employee Edit Page', () => {
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

  it('prefills form, saves successfully and redirects', () => {
    cy.intercept('GET', 'https://reqres.in/api/users/1', {
      statusCode: 200,
      body: { data: user },
    }).as('getUser');

    cy.visit('/employee/1/edit');
    cy.wait('@getUser');

    cy.get('#first_name').should('have.value', 'George');
    cy.get('#last_name').should('have.value', 'Bluth');
    cy.get('#email').should('have.value', 'george.bluth@reqres.in');

    cy.intercept('PUT', 'https://reqres.in/api/users/1', {
      statusCode: 200,
      body: { data: { ...user, first_name: 'G', last_name: 'B' } },
    }).as('updateUser');

    cy.get('#first_name').clear().type('G');
    cy.get('#last_name').clear().type('B');
    cy.get('#employee-submit').click();

    cy.wait('@updateUser');
    cy.location('pathname').should('eq', '/');
  });

  it('shows error toast when save fails', () => {
    cy.intercept('GET', 'https://reqres.in/api/users/1', {
      statusCode: 200,
      body: { data: user },
    }).as('getUser');

    cy.visit('/employee/1/edit');
    cy.wait('@getUser');

    cy.intercept('PUT', 'https://reqres.in/api/users/1', {
      statusCode: 400,
      body: { error: 'update failed' },
    }).as('updateUserFail');

    cy.get('#employee-submit').click();
    cy.wait('@updateUserFail');
    cy.contains(/update failed/i).should('be.visible');
  });

  it('Back goes to the show page', () => {
    cy.intercept('GET', 'https://reqres.in/api/users/1', {
      statusCode: 200,
      body: { data: user },
    }).as('getUser');

    cy.visit('/employee/1/edit');
    cy.wait('@getUser');
    cy.get('#employee-back').click();
    cy.location('pathname').should('eq', '/employee/1');
  });
});


