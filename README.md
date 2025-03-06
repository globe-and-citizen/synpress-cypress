# Web3 Testing for Celebrity Fanalyzer

## 📌 Project Description

This project aims to provide **Web3 testing** for the **Celebrity Fanalyzer** website ([celebrity-fanalyzer.com](https://celebrity-fanalyzer.com)) using **Synpress** integration with **Cypress**.

## 🛠️ Tech Stack

- **Cypress** (for End-to-End testing)
- **Synpress** (MetaMask & Web3 interaction)
- **Node.js** `v18.20.2`

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🔧 Configuration

Before running tests, update the **wallet credentials** in:

```bash
test/cypress/fixtures/env.json
```

### Example `env.json`:

```json
{
  "walletAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "privateKey": "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
}
```

## 📝 File Permissions

Ensure the project folder has the correct write permissions to allow files to be updated during tests. You can set the appropriate permissions using the following command:

```bash
chmod -R u+w .
```

This command grants write permissions to the user for all files and directories within the project folder.

# 🏃‍♂️ Running Tests

## Stop Hardhat Node

To stop the Hardhat node, run the following command:

```bash
npm run stop:hardhat
```

### Start Hardhat Node, Compile and Deploy Contracts

To start the Hardhat node, compile, and deploy contracts, use the following command:

```bash
npm run start:deploy:hardhat
```

After the deployment, please copy the respective contract addresses to the Celebrity Fanalyzer project.

⚠ **Keep this file secure and do not expose it publicly!**

Add or update the following environment variables in your target project (e.g., Celebrity Fanalyzer) the values should be what you get from the deploy script:

```bash
VITE_ADVERTISEMENT_CAMPAIGN_CONTRACT_ADDRESS=""
VITE_ESCROW_CONTRACT=""
```

Ensure these variables are correctly set in your environment configuration file (e.g., `.env`) to enable proper functionality of the advertisement campaign and escrow contract features.

### Run Cypress UI:

```bash
npm run test:cypress:ui
```

### Run Advertisement Tests:

```bash
npm run test:cypress:ui:advertisements
```

## 📝 Notes

- Ensure **MetaMask is installed** and configured before running tests.
- The project supports **both UI & headless test execution**.
- Always check and update **Synpress settings** for compatibility with the latest MetaMask versions.

## 📢 Contribution

Feel free to submit **issues, PRs, or improvements** for better Web3 test automation! 🚀
