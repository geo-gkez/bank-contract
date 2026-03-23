import { ethers } from "hardhat";

async function main() {
  // 1. Compile and get the contract factory
  const Bank = await ethers.getContractFactory("Bank");

  // 2. Send the deployment transaction
  const bank = await Bank.deploy();

  // 3. Wait for it to be mined
  await bank.waitForDeployment();

  // 4. Read the address it was deployed to
  console.log("Bank deployed to:", await bank.getAddress());
}

main().catch(console.error);
