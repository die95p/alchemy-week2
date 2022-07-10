// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt)
}
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address))
    idx++
  }
}
async function printMemos(memos) {
  for (const memo of memos) {
    const {
      timestamp,
      name: tipper,
      from: tipperAddress,
      message
    } = memo
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said : "${message}"`)
  }
}
async function main() {
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy()
  await buyMeACoffee.deployed()
  console.log("BuyMeACoffee deployed to ", buyMeACoffee.address)
  const addresses = [owner.address, tipper.address, buyMeACoffee.address]
  console.log('--- Strart ---')
  await printBalances(addresses)
  const tip = { value: hre.ethers.utils.parseEther("1") }
  await buyMeACoffee.connect(tipper).buyCoffee("Diego", "1", tip)
  await buyMeACoffee.connect(tipper2).buyCoffee("Ilaria", "2", tip)
  await buyMeACoffee.connect(tipper3).buyCoffee("Qwerty", "3", tip)
  console.log('--- bought coffeee ---')
  await printBalances(addresses)
  await buyMeACoffee.connect(owner).withdrawTips();
  console.log('--- withDrawTips ---')
  await printBalances(addresses)
  console.log('--- memos ---')
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
