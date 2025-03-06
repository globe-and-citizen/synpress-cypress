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

  it("should withdraw amount spent (Admin only)", () => {
    cy.readFile("test/cypress/fixtures/title.json").then((data) => {
      cy.get(".ads-select").click();
      cy.contains(".q-item", "All").click();
      cy.get('input[placeholder="Search"]').type(data.adTitle);
      cy.wait(300);
      cy.get('[data-test="withdraw-amount"]').first().click();

      cy.customSwitchNetwork("Hardhat Network");
      cy.customConnectWeb3();

      cy.get('[data-test="withdraw-amount"]').first().click();
      cy.contains("Available Amount to withdraw").should("be.visible");
      cy.contains(
        "The current balance to claim should be greater than zero"
      ).should("not.exist");
      cy.get('[data-test="confirm-withdraw-amount-button"]').click({
        force: true,
      });
      cy.confirmTransactionAndWaitForMining().then((result) => {
        expect(result).to.be.true;
        cy.wait(1000);
      });
    });

    cy.contains("Campaign payment claimed successfully").should("be.visible");
  });
});
