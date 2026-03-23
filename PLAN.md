# Simple Bank Smart Contract — Task Roadmap

## Contract
- [x] **Task 1** — Deposit Funds: `depositFunds()` payable + `accountBalance` mapping
- [x] **Task 2** — Withdraw Funds: `withdrawFunds(uint256)` with balance check
- [x] **Task 3** — Transfer Funds: `transferFunds(address, uint256)` between accounts
- [x] **Task 4** — Get Balance: `getBalance()` view function
- [x] **Task 5** — Transaction History: events + `getTransactionHistory()` returning block numbers

## Tests
- [ ] **Task 5b** — `test/Bank.ts`: deposit, withdraw, transfer, balance, history

## Deployment
- [x] **Task 6** — Deployment scripts: Ignition module + standalone `scripts/deploy.ts`
- [x] **Task 7** — Deploy to local Hardhat node, note contract address

## Interaction
- [x] **Task 8** — Hardhat console: manually call all functions
- [x] **Task 9** — `scripts/demo.ts`: automate Task 8 calls
- [x] **Task 10** — Extend `scripts/demo.ts`: decode full transaction history

## External Connection
- [x] **Task 11** — `scripts/connect.ts`: connect to deployed contract without redeploying
- [x] **Task 12** — Verify connection: provider check, block number, `getBalance()`
- [x] **Task 13** — Full history from `scripts/connect.ts`

## UI
- [x] **Task 14** — `ui/index.html`: Vue 3 + ethers.js frontend with MetaMask
