const hre = require("hardhat");
const readline = require("readline");

async function main() {
  // Get the contract factory
  const escrowManager = await hre.ethers.getContractFactory(
    "CompetitionEscrow"
  );

  // Deploy the contract with arguments
  const escrow = await escrowManager.deploy();

  // Wait for deployment to complete
  await escrow.waitForDeployment();

  console.log(
    "Deployed ESCROW contract address ============== : ",
    escrow.target
  );
}

// Execute the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
