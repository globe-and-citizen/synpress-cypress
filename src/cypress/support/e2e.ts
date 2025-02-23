import { synpressCommandsForMetaMask } from "@synthetixio/synpress/cypress/support";

Cypress.on("uncaught:exception", () => {
  // failing the test
  return false;
});

synpressCommandsForMetaMask();

Cypress.Commands.add("customSwitchNetwork", (netWorkName) => {
  cy.getNetwork().then((network) => {
    if (network === netWorkName) {
      cy.log("Network is already selected");
      return true;
    } else {
      //cy.toggleShowTestNetworks();
      if (netWorkName === "hardhat") {
        //let's add hardhat network
        cy.addNetwork({
          blockExplorerUrl: "",
          chainId: 31337,
          name: "hardhat",
          rpcUrl: "http://localhost:8545",
          symbol: "ETH",
        });
      }
      cy.getAccountAddress().then((address) => {
        cy.readFile("test/cypress/fixtures/env.json").then((data) => {
          if (!data.private_key || !data.wallet_address) {
            cy.log(" Missing private key or wallet address in env.json");
            return; // Stop execution if data is missing
          }
          let private_key = data.private_key;
          let wallet_address = data.wallet_address;
          if (address !== wallet_address) {
            cy.importWalletFromPrivateKey(private_key);
          }
        });
      });
      cy.switchNetwork(netWorkName, true);
    }
  });

  // cy.switchNetwork(netWorkName, true).then((result) => {
  //   expect(result).to.eq(true);
  //   cy.log("Network switch successful");
  // });
});
Cypress.Commands.add("customConnectWeb3", () => {
  cy.window().then((win) => {
    const modal = win?.document?.querySelector("body > w3m-modal");
    if (modal && modal.shadowRoot) {
      const button = modal.shadowRoot
        .querySelector("wui-flex > wui-card > w3m-router")
        ?.shadowRoot?.querySelector("div > w3m-connect-view")
        ?.shadowRoot?.querySelector("wui-flex > w3m-wallet-login-list")
        ?.shadowRoot?.querySelector("wui-flex > w3m-connect-announced-widget")
        ?.shadowRoot?.querySelector("wui-flex > wui-list-wallet")
        ?.shadowRoot?.querySelector("button");
      if (button) {
        button.click();
        try {
          cy.connectToDapp();
        } catch (error) {
          cy.log("⚠️ cy.connectToDapp() failed but test continues:", error);
        }
        cy.wait(5000);
      }
    }
  });
});

Cypress.Commands.add("login", () => {
  cy.wait(10000);
  cy.session("login", () => {
    cy.visit("/profile");
    // Fill the email and password fields and click the sign in button
    cy.get('[data-test="email-field"]', { timeout: 60000 }).type(
      "test@test.com"
    );
    cy.get('[data-test="password-field"]').type("12345678");
    cy.get('[data-test="sign-button"]').click();
    // Visits the Admin Page
    cy.get("tab-profile").click({ force: true });
    cy.visit("/admin");
    // cy.get('[href="/admin"]').click()
    //cy.location("pathname").should("eq", "/admin/prompts");
  });
});

// Cypress.Commands.add('login', () => {
//   cy.session('login', () => {
//     cy.visit('/profile')
//     // Fill the email and password fields and click the sign in button
//     cy.get('[data-test="email-field"]', { timeout: 60000 }).type('test@test.com')
//     cy.get('[data-test="password-field"]').type('12345678')
//     cy.get('[data-test="sign-button"]').click()
//     // Visits the Admin Page
//     cy.getByData('tab-profile').click({ force: true })
//     cy.visit('/admin')
//     // cy.get('[href="/admin"]').click()
//     cy.location('pathname').should('eq', '/admin/prompts')
//   })
// })
Cypress.Commands.add("loginToProfile", () => {
  cy.session("login", () => {
    cy.visit("/profile");
    cy.wait(10000);
    // Fill the email and password fields and click the sign in button
    cy.get('[data-test="email-field"]').type("test@test.com");
    cy.get('[data-test="password-field"]').type("12345678");
    cy.get('[data-test="sign-button"]').click();
    // Visits the Admin Page
    cy.get('[data-test="tab-profile"]').click({ force: true });

    // cy.get('[href="/admin"]').click()
    // cy.location("pathname").should("eq", "/admin/prompts");
  });
});

Cypress.Commands.add("ensureLogout", () => {
  cy.wait(10000);
  cy.visit("/profile");
  cy.get('[data-test="Open Connect Modal"]').should("be.visible");
  // Trigger the dialog where the getAddress method is used
  cy.get('[data-test="Open Connect Modal"]').click();
  cy.contains("Wallet address change").then(($changeWallet) => {
    if ($changeWallet.length) {
      cy.get('[data-test="confirm-change-wallet"]').then(($btn) => {
        if ($btn.length) {
          cy.log("Disconnecting wallet ================");
          cy.get('[data-test="confirm-change-wallet"]').click({ force: true });
          cy.wait(20000);
          cy.window().then((win) => {
            const disconnectbtn = win?.document
              ?.querySelector("body > w3m-modal")
              ?.shadowRoot.querySelector("wui-flex > wui-card > w3m-router")
              ?.shadowRoot.querySelector("div > w3m-account-view")
              ?.shadowRoot.querySelector("w3m-account-default-widget")
              ?.shadowRoot.querySelector(
                "wui-flex:nth-child(2) > wui-list-item:nth-child(5)"
              )
              ?.shadowRoot.querySelector("button");

            if (disconnectbtn) {
              disconnectbtn.click();
            }
          });
        }
      });
    }
  });

  cy.wait(10000);
  cy.get('[data-test="tab-settings"]').click({ force: true });
  cy.get('[data-test="logout-button"]').click({ force: true });
  cy.wait(10000);
  cy.clearLocalStorage();
});
Cypress.Commands.add("loginToAdmin", () => {
  cy.wait(10000);
  cy.session("login", () => {
    cy.visit("/profile");
    cy.wait(10000);

    // Fill the email and password fields and click the sign in button
    cy.get('[data-test="email-field"]').type("test@test.com");
    cy.get('[data-test="password-field"]').type("12345678");

    cy.get('[data-test="sign-button"]').click();
    // Visits the Admin Page
    cy.get('[data-test="tab-profile"]').click({ force: true });
    cy.visit("/admin");
    // cy.get('[href="/admin"]').click()
    // cy.location("pathname").should("eq", "/admin/prompts");
  });
});

before(() => {
  cy.visit("/");
});
