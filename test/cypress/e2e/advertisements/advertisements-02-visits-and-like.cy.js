/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />
// Use `cy.dataCy` custom command for more robust tests
// See https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements

describe("create new advertise", () => {
  let date = "";
  let visit = "/";

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.reload();
    cy.wait(2000);
    cy.viewport("macbook-16");
    //visits the profile page

    cy.loginToAdmin();
    cy.visit("/admin/advertises");
  });

  it("should filter and visit  advertisements by search input", () => {
    cy.readFile("test/cypress/fixtures/title.json").then((data) => {
      let title = data.adTitle;
      cy.get(".ads-select").click();
      cy.contains(".q-item", "All").click();

      cy.wait(300);
      cy.get('input[placeholder="Search"]').type(title);
      cy.wait(300); // Allow debounce time
      cy.get(".custom-table").should("contain", title); // Ensure filtered result appears
      cy.contains("td", title) // Find <td> with this exact text
        .should("be.visible") // Ensure it is visible before clicking
        .click({ force: true }); // Click on the second td of the first corresponding row
      cy.contains(title).should("be.visible");
      cy.wait(10000);
      cy.get('[data-test="like-button"]')
        .should("exist")
        .click({ force: true });
    });
  });
});
