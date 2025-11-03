const makeUsers = (offset = 0) => {
  return Array.from({ length: 6 }).map((_, i) => {
    const id = i + 1 + offset;
    return {
      id,
      email: `user${id}@example.com`,
      first_name: `First${id}`,
      last_name: `Last${id}`,
      avatar: `https://example.com/avatar/${id}.png`,
    };
  });
};

describe('Dashboard - EmployeeList', () => {
  beforeEach(() => {
    // Bypass auth middleware
    cy.setCookie('auth_token', 'e2e_token');
  });

  const interceptPage = (page: number, per_page = 6) => {
    const offset = (page - 1) * per_page;
    cy.intercept(
      'GET',
      `https://reqres.in/api/users?page=${page}&per_page=${per_page}`,
      {
        statusCode: 200,
        body: {
          page,
          per_page,
          total: 12,
          total_pages: 2,
          data: makeUsers(offset),
        },
      },
    ).as(`getUsersPage${page}`);
  };

  it('loads and renders the first page, allows navigation and actions', () => {
    interceptPage(1);
    interceptPage(2);

    cy.visit('/');
    cy.wait('@getUsersPage1');

    // Columns visible
    cy.contains('[role="columnheader"]', 'ID').should('be.visible');
    cy.contains('[role="columnheader"]', 'First Name').should('be.visible');
    cy.contains('[role="columnheader"]', 'Last Name').should('be.visible');
    cy.contains('[role="columnheader"]', 'Email').should('be.visible');

    // Rows rendered
    cy.contains('[role="row"]', 'First1').should('be.visible');
    cy.contains('[role="row"]', 'Last6').should('be.visible');

    // Refresh triggers refetch
    cy.intercept('GET', 'https://reqres.in/api/users?page=1&per_page=6').as('refetchPage1');
    cy.get('#refresh-button').click();
    cy.wait('@refetchPage1');

    // Pagination to next/last page (robust to different aria-labels/locales)
    cy.get('.MuiTablePagination-actions button').last().click();
    cy.wait('@getUsersPage2');
    cy.contains('[role="row"]', 'First7').should('be.visible');

    // Navigate to details by clicking a row
    cy.contains('[role="row"]', 'First7').click();
    cy.location('pathname').should('eq', '/employee/7');

    // Back to dashboard
    cy.visit('/');
    interceptPage(1);
    cy.wait('@getUsersPage1');

    // Edit action navigates to edit page
    cy.contains('[role="row"]', 'First2').within(() => {
      cy.get('#edit-2').click({ force: true });
    });
    cy.location('pathname').should('eq', '/employee/2/edit');

    // Back and test delete with confirm
    cy.visit('/');
    interceptPage(1);
    cy.wait('@getUsersPage1');

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });
    cy.intercept('DELETE', 'https://reqres.in/api/users/1', {
      statusCode: 204,
      body: {},
    }).as('deleteUser1');

    cy.contains('[role="row"]', 'First1').within(() => {
      cy.get('#delete-1').click({ force: true });
    });
    cy.wait('@deleteUser1');
  });

  it('shows error state when API fails', () => {
    cy.intercept('GET', 'https://reqres.in/api/users?page=1&per_page=6', {
      statusCode: 500,
      body: { error: 'server error' },
    }).as('getUsersFail');

    cy.visit('/');
    cy.wait('@getUsersFail');
    cy.contains('.MuiAlert-message', /server error/i).should('be.visible');
  });

  it('Create button navigates to /new', () => {
    interceptPage(1);
    cy.visit('/');
    cy.wait('@getUsersPage1');
    cy.get('#create-button').click();
    cy.location('pathname').should('eq', '/new');
  });

  it('shows toast on delete failure', () => {
    interceptPage(1);
    cy.visit('/');
    cy.wait('@getUsersPage1');

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });

    cy.intercept('DELETE', 'https://reqres.in/api/users/1', {
      statusCode: 400,
      body: { error: 'delete failed' },
    }).as('deleteUserFail');

    cy.contains('[role="row"]', 'First1').within(() => {
      cy.get('#delete-1').click({ force: true });
    });
    cy.wait('@deleteUserFail');
    cy.contains(/delete failed/i).should('be.visible');
  });
});


