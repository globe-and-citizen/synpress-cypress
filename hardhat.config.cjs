require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

//const sepoliaproviderUrl = process.env.VITE_SEPOLIA_PROVIDER_URL;
//const sepoliaPrivateKey = process.env.VITE_SEPOLIA_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200, // Use the same optimizer runs as during deployment
    },
    metadata: {
      bytecodeHash: "none", // Prevents extra debug metadata
    },
    evmVersion: "london", // Matches Sepolia's EVM behavior
  },

  networks: {
    // sepolia: {
    //   url: sepoliaproviderUrl,
    //   accounts: [sepoliaPrivateKey],
    // },
  },
  sourcify: {
    enabled: true,
  },
};
