/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />
// Use `cy.dataCy` custom command for more robust tests
// See https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements

describe("create new advertise", () => {
  let date = "";
  let visit = "/";
  const generateAdTitle = () => {
    const timestamp = new Date().getTime();
    return `${timestamp}`;
  };

  let title = generateAdTitle();

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

  it("create new advertise", () => {
    cy.writeFile("test/cypress/fixtures/title.json", { adTitle: title });
    cy.wait(10000);
    cy.get('[data-test="dropdown-menu"]').should("be.visible");
    cy.get('[data-test="dropdown-menu"]').click();
    cy.get('[data-test="create-advertise"]').click();
    cy.customSwitchNetwork("sepolia");
    cy.customConnectWeb3();
    cy.get('[data-test="dropdown-menu"]').click();
    cy.get('[data-test="create-advertise"]').click();
    cy.get('[data-test="input-title"]').type(title);
    cy.get('[data-test="select-type-text"]').click();
    cy.get('[data-test="input-description"]').type("cypress test description");
    cy.get('[data-test="input-product-link"]').type("http://theProductUrl.com");
    // cy.get('[data-test="date"]').click();
    cy.get('[data-test="date"]').type("2025-02-10", { force: true });
    cy.get('[data-test="input-duration"]').type(13, { force: true });
    cy.get('[data-test="input-budget"]').type(1);
    cy.get('[data-test="button-submit"]').click({ force: true });
    cy.wait(10000);
    // cy.confirmTransaction().then(result=>{

    // });
    cy.confirmTransactionAndWaitForMining().then((result) => {
      expect(result).to.be.true;
      cy.wait(20000);
    });
  });
});
