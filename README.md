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
  "walletAddress": "your-wallet-address",
  "privateKey": "your-private-key"
}
```

⚠ **Keep this file secure and do not expose it publicly!**

## 🏃‍♂️ Running Tests

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
