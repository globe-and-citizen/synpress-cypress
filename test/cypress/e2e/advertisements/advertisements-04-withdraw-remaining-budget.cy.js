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

  it("should withdraw remaining budget (Advertiser only)", () => {
    cy.readFile("test/cypress/fixtures/title.json").then((data) => {
      cy.get(".ads-select").click();
      cy.contains(".q-item", "All").click();
      cy.get('input[placeholder="Search"]').type(data.adTitle);
      cy.wait(300);
      cy.get('[data-test="withdraw-remaining-budget"]')
        .first()
        .click({ force: true });
      cy.contains("Withdraw Remaining Budget").should("be.visible");
      cy.get('[data-test="confirm-withdraw-remaining-button"]')
        .first()
        .click({ force: true });

      cy.customSwitchNetwork("sepolia");
      cy.customConnectWeb3();
      cy.get('[data-test="withdraw-remaining-budget"]')
        .first()
        .click({ force: true });
      cy.contains("Withdraw Remaining Budget").should("be.visible");
      cy.get('[data-test="confirm-withdraw-remaining-button"]')
        .first()
        .click({ force: true });

      cy.confirmTransactionAndWaitForMining().then((result) => {
        expect(result).to.be.true;
        cy.wait(40000);
      });
      //cy.contains("Remaining budget withdrawn successfully").should("be.visible");
    });
  });
});
