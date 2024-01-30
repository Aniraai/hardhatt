// import
// main function

const { network } = require("hardhat")

// calling main function

// function deployFunc() {
//   console.log("Hi");
// }

// module.exports.default = deployFunc;

const {networkConfig} =require("../helper-hardhat.config")

module.exports=async ({getNameAccounts,deployments}) =>{

   const{deploy,log}=deployments
   const {deployer}=await getNameAccounts()
   const chainId=network.config.chainId;

   const ethUsdpriceFeedAddress =networkConfig[chainId]["ethUsdpriceFeed"]

   const fundme =await deploy("FundMe",{
        from:deployer,
        args:[address],
        log:true,
   })

}


