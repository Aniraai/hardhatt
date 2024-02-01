const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat.config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  let ethUsdAggregator;

  if (chainId == 31337) {
    try {
      ethUsdAggregator = await deployments.get("MockV3Aggregator");
    } catch (error) {
      log("MockV3Aggregator deployment not found. Deploy it first.");
      throw error;
    }

    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId] && networkConfig[chainId]["ethUsdPriceFeed"];
  }

  log("----------------------------------------------------");
  log("Deploying FundMe and waiting for confirmations...");

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    // Wait for confirmations if on a live network for proper verification
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`FundMe deployed at ${fundMe.address}`);

  if (
    developmentChains &&
    developmentChains.includes &&
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, [ethUsdPriceFeedAddress]);
  }
};

module.exports.tags = ["all", "fundme"];
