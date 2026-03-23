import { ethers } from "hardhat";
import BankArtifact from "../artifacts/contracts/Bank.sol/Bank.json";

const BANK_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  // Get a signer (the first Hardhat test account)
  const signer = await ethers.provider.getSigner();

  // Create the contract instance using the raw ABI and address
  const bank = new ethers.Contract(BANK_ADDRESS, BankArtifact.abi, signer);

  console.log("Connected to Bank at:", await bank.getAddress());

  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "| Chain ID:", network.chainId);

  const blockNumber = await ethers.provider.getBlockNumber();
  console.log("Latest block:", blockNumber);

  const balance = await bank.getBalance();
  console.log("Balance:", ethers.formatEther(balance), "ETH");

  const transactionHistory = await bank.getTransactionHistory();
  console.log("Transaction history (block numbers):", transactionHistory);

  if (transactionHistory.length === 0) {
    console.log("No transaction history found.");
    return;
  }

  for (const txBlock of transactionHistory) {
    const block = await ethers.provider.getBlock(txBlock);
    if (!block) continue;

    for (const txHash of block.transactions) {
      const tx = await ethers.provider.getTransaction(txHash);
      const decoded = bank.interface.parseTransaction({
        data: tx!.data,
        value: tx!.value,
      });
      console.log(`Block ${txBlock} - Function: ${decoded?.name}`);
      console.log("  Args:", decoded?.args);
    }
  }
}

main().catch(console.error);
