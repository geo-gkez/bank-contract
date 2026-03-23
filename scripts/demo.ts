import { ethers } from "hardhat";

async function main() {
  const [owner, user1] = await ethers.getSigners();

  const bank = await ethers.getContractAt(
    "Bank",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  );

  // Deposit 1 ETH
  await bank.depositFunds({ value: ethers.parseEther("1.0") });
  console.log("Deposited 1.0 ETH");

  // Check balance after deposit
  const balanceAfterDeposit = await bank.getBalance();
  console.log(
    "Balance after deposit:",
    ethers.formatEther(balanceAfterDeposit),
    "ETH",
  );

  // Withdraw 0.5 ETH
  await bank.withdrawFunds(ethers.parseEther("0.5"));
  console.log("Withdrawn 0.5 ETH");

  // Check balance after withdrawal
  const balanceAfterWithdraw = await bank.getBalance();
  console.log(
    "Balance after withdrawal:",
    ethers.formatEther(balanceAfterWithdraw),
    "ETH",
  );

  // Transfer 0.1 ETH to user1
  await bank.transferFunds(user1.address, ethers.parseEther("0.1"));
  console.log("Transferred 0.1 ETH to user1:", user1.address);

  // Get transaction history
  const history = await bank.getTransactionHistory();
  console.log("Transaction history (block numbers):", history);

  for (const blockNumber of history) {
    const block = await ethers.provider.getBlock(blockNumber);
    if (!block) continue;

    for (const txHash of block.transactions) {
      const tx = await ethers.provider.getTransaction(txHash);
      const decoded = bank.interface.parseTransaction({
        data: tx!.data,
        value: tx!.value,
      });
      console.log(`Block ${blockNumber} - Function: ${decoded?.name}`);
      console.log("  Args:", decoded?.args);
    }
  }
}

main().catch(console.error);
