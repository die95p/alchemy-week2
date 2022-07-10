const hre = require("hardhat")
async function main() {
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy()
    await buyMeACoffee.deployed()
    console.log("BuyMeACoffee deployed to ", buyMeACoffee.address)

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
