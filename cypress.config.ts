import { configureSynpressForMetaMask } from "@synthetixio/synpress/cypress";
import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: true,
  video: true,
  defaultCommandTimeout: 100000,
  pageLoadTimeout: 60000,
  e2e: {
    baseUrl: "http://localhost:9200",
    specPattern: "test/cypress/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "src/cypress/support/e2e.{js,jsx,ts,tsx}",
    testIsolation: false,
    async setupNodeEvents(on, config) {
      return configureSynpressForMetaMask(on, config);
    },
  },
});
