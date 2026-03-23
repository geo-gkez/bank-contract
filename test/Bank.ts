import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// A fixture deploys the contract once and snapshots the chain state.
// loadFixture reuses that snapshot for every test — fast and isolated.
async function deployBankFixture() {
  const [owner, user1, user2] = await ethers.getSigners();
  const bank = await ethers.deployContract("Bank");
  return { bank, owner, user1, user2 };
}

describe("Bank", function () {

  // ─── depositFunds ──────────────────────────────────────────────────────────
  describe("depositFunds", function () {

    it("credits the deposited amount to the sender's balance", async function () {
      const { bank } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });

      expect(await bank.getBalance()).to.equal(ethers.parseEther("1.0"));
    });

    it("accumulates multiple deposits", async function () {
      const { bank } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });
      await bank.depositFunds({ value: ethers.parseEther("0.5") });

      expect(await bank.getBalance()).to.equal(ethers.parseEther("1.5"));
    });

    it("reverts when deposit amount is zero", async function () {
      const { bank } = await loadFixture(deployBankFixture);

      await expect(bank.depositFunds({ value: 0 }))
        .to.be.revertedWith("Deposit amount must be greater than zero.");
    });

    it("emits a Deposit event with the correct amount", async function () {
      const { bank, owner } = await loadFixture(deployBankFixture);

      await expect(bank.depositFunds({ value: ethers.parseEther("1.0") }))
        .to.emit(bank, "Deposit")
        .withArgs(owner.address, ethers.parseEther("1.0"));
    });

  });

  // ─── withdrawFunds ─────────────────────────────────────────────────────────
  describe("withdrawFunds", function () {

    it("deducts the withdrawn amount from the sender's balance", async function () {
      const { bank } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });
      await bank.withdrawFunds(ethers.parseEther("0.4"));

      expect(await bank.getBalance()).to.equal(ethers.parseEther("0.6"));
    });

    it("sends ETH back to the sender's wallet", async function () {
      const { bank, owner } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });

      // changeEtherBalance checks the wallet balance change (gas-adjusted)
      await expect(bank.withdrawFunds(ethers.parseEther("1.0")))
        .to.changeEtherBalance(owner, ethers.parseEther("1.0"));
    });

    it("reverts when amount exceeds balance", async function () {
      const { bank } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });

      await expect(bank.withdrawFunds(ethers.parseEther("2.0")))
        .to.be.revertedWith("Withdrawal amount must be less or equal than balance");
    });

    it("reverts when amount is zero", async function () {
      const { bank } = await loadFixture(deployBankFixture);

      await expect(bank.withdrawFunds(0))
        .to.be.revertedWith("Withdrawal amount must be greater than zero.");
    });

    it("emits a Withdrawal event with the correct amount", async function () {
      const { bank, owner } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });

      await expect(bank.withdrawFunds(ethers.parseEther("1.0")))
        .to.emit(bank, "Withdrawal")
        .withArgs(owner.address, ethers.parseEther("1.0"));
    });

  });

  // ─── transferFunds ─────────────────────────────────────────────────────────
  describe("transferFunds", function () {

    it("deducts from sender and credits recipient", async function () {
      const { bank, user1 } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });
      await bank.transferFunds(user1.address, ethers.parseEther("0.4"));

      expect(await bank.getBalance()).to.equal(ethers.parseEther("0.6"));
      expect(await bank.connect(user1).getBalance()).to.equal(ethers.parseEther("0.4"));
    });

    it("reverts when amount exceeds balance", async function () {
      const { bank, user1 } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });

      await expect(bank.transferFunds(user1.address, ethers.parseEther("2.0")))
        .to.be.revertedWith("Insufficient balance");
    });

    it("reverts when amount is zero", async function () {
      const { bank, user1 } = await loadFixture(deployBankFixture);

      await expect(bank.transferFunds(user1.address, 0))
        .to.be.revertedWith("Transfer amount must be greater than zero.");
    });

    it("reverts when transferring to the zero address", async function () {
      const { bank } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });

      await expect(bank.transferFunds(ethers.ZeroAddress, ethers.parseEther("0.1")))
        .to.be.revertedWith("Cannot transfer to zero address");
    });

    it("reverts when transferring to self", async function () {
      const { bank, owner } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });

      await expect(bank.transferFunds(owner.address, ethers.parseEther("0.1")))
        .to.be.revertedWith("We need 2 different wallets");
    });

    it("emits a Transfer event with correct arguments", async function () {
      const { bank, owner, user1 } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });

      await expect(bank.transferFunds(user1.address, ethers.parseEther("0.4")))
        .to.emit(bank, "Transfer")
        .withArgs(owner.address, user1.address, ethers.parseEther("0.4"));
    });

  });

  // ─── getBalance ────────────────────────────────────────────────────────────
  describe("getBalance", function () {

    it("returns zero for a new account", async function () {
      const { bank } = await loadFixture(deployBankFixture);

      expect(await bank.getBalance()).to.equal(0);
    });

    it("returns only the caller's balance, not others'", async function () {
      const { bank, user1 } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });
      await bank.connect(user1).depositFunds({ value: ethers.parseEther("2.0") });

      expect(await bank.getBalance()).to.equal(ethers.parseEther("1.0"));
      expect(await bank.connect(user1).getBalance()).to.equal(ethers.parseEther("2.0"));
    });

  });

  // ─── getTransactionHistory ─────────────────────────────────────────────────
  describe("getTransactionHistory", function () {

    it("returns an empty array for a new account", async function () {
      const { bank } = await loadFixture(deployBankFixture);

      expect(await bank.getTransactionHistory()).to.deep.equal([]);
    });

    it("records a block number for each transaction", async function () {
      const { bank } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });
      await bank.withdrawFunds(ethers.parseEther("0.5"));

      const history = await bank.getTransactionHistory();
      expect(history.length).to.equal(2);
    });

    it("records history for both sender and recipient on transfer", async function () {
      const { bank, user1 } = await loadFixture(deployBankFixture);

      await bank.depositFunds({ value: ethers.parseEther("1.0") });
      await bank.transferFunds(user1.address, ethers.parseEther("0.5"));

      const senderHistory = await bank.getTransactionHistory();
      const recipientHistory = await bank.connect(user1).getTransactionHistory();

      expect(senderHistory.length).to.equal(2);   // deposit + transfer
      expect(recipientHistory.length).to.equal(1); // received transfer
    });

  });

});
