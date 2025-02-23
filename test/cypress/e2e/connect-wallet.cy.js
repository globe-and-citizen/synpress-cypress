/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />
// Use `cy.dataCy` custom command for more robust tests
// See https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements

describe("connect wallet to dapp", () => {
  let date = "";
  let visit = "/";
  beforeEach(() => {
    cy.viewport("macbook-16");
    // Visits the profile page
    cy.loginToProfile();
  });

  it("should proceed with the default wallet address", () => {
    // Mock the behavior of the function that gets the wallet address
    cy.get('[data-test="Open Connect Modal"]').should("be.visible");
    // Trigger the dialog where the getAddress method is used
    cy.get('[data-test="Open Connect Modal"]').click();

    // Assert that the mocked address is used

    //cy.get('[data-testid="wallet-selector-eip6963"]').should('be.visible')
    //cy.contains('MetaMask').should('be.visible')
    //fill in the form
    // cy.window().then((win) => {
    //   const button = win.document
    //     .querySelector("body > w3m-modal")
    //     .shadowRoot.querySelector("wui-flex > wui-card > w3m-router")
    //     .shadowRoot.querySelector("div > w3m-connect-view")
    //     .shadowRoot.querySelector("wui-flex > w3m-wallet-login-list")
    //     .shadowRoot.querySelector("wui-flex > w3m-connect-recommended-widget")
    //     .shadowRoot.querySelector("wui-flex > wui-list-wallet:nth-child(1)")
    //     .shadowRoot.querySelector("button");
    //   if (button) {
    //     button.click();
    //   }
    // });
    cy.contains("Change wallet").then(($changeWallet) => {
      if (!$changeWallet.length) {
        cy.get('[data-test="cancel-address-change"]').then(($btn) => {
          if ($btn.length) {
            $btn.click();
          } else {
            cy.window().then((win) => {
              const button = win.document
                .querySelector("body > w3m-modal")
                .shadowRoot.querySelector("wui-flex > wui-card > w3m-router")
                .shadowRoot.querySelector("div > w3m-connect-view")
                .shadowRoot.querySelector("wui-flex > w3m-wallet-login-list")
                .shadowRoot.querySelector(
                  "wui-flex > w3m-connect-announced-widget"
                )
                .shadowRoot.querySelector("wui-flex > wui-list-wallet")
                .shadowRoot.querySelector("button");
              if (button) {
                button.click();
                cy.connectToDapp();
                cy.wait(5000);
                cy.switchToMetamaskIfNotActive();
                cy.switchNetwork({ network: "Sepolia", isTestnet: true });
                cy.toggleShowTestNetworks();
                cy.approveSwitchNetwork();
              }
            });
          }
        });
      }
    });

    cy.wait(5000);
    cy.visit("/admin");
  });
});
