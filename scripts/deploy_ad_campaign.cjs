const hre = require("hardhat");
const readline = require("readline");

async function main() {
  console.log("Deploying AdCampaignManager contract .......");
  // Get the contract factory
  const AdCampaignManager = await hre.ethers.getContractFactory(
    "AdCampaignManager"
  );

  // Define the arguments for deployment
  //"0x1A8CB018e2A8dAb791f921679a5A93189F6CF014"
  //"0x20fbda3bFa938BeCe8F16b3B331a6bb468817C75"
  const bankContractAddress = "0x1A8CB018e2A8dAb791f921679a5A93189F6CF014"; // Replace with the actual bank contract address
  const costPerClick = "1000000000000000"; // Example: 0.01 ETH per click
  const costPerImpression = "2000000000000000"; // Example: 0.005 ETH per impression

  // Deploy the contract with arguments
  const adCampaignManager = await AdCampaignManager.deploy(
    costPerClick,
    costPerImpression,
    bankContractAddress
  );

  // Wait for deployment to complete
  await adCampaignManager.waitForDeployment();

  console.log(
    "Deployed AD CAMPAIGN contract address ===================> : ",
    adCampaignManager.target
  );
}

// Execute the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
