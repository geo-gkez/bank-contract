# Simple Bank Smart Contract — Project Guide

## Project Goal
Build a Simple Bank smart contract in Solidity, deploy it on a local Hardhat network, and interact with it via console, scripts, and a Vue.js UI. This is a learning project — the user is new to smart contracts.

## Tech Stack
- **Solidity 0.8.34**
- **Hardhat 2.28** + `@nomicfoundation/hardhat-toolbox` (ethers v6, typechain, chai, mocha)
- **TypeScript** (strict mode)
- **Hardhat Ignition** for declarative deployment
- **Vue 3 + ethers.js via CDN** for the UI (Task 14, deferred)

## How to Work With the User (Mentor Mode)
- Guide **one task at a time** — do not skip ahead or provide future task code
- Start each task with: **what** it does and **why** it matters (especially security implications)
- Ask the user to attempt code themselves before showing solutions
- Show code only when the user is stuck, asks for it, or needs to verify their work
- After each task: confirm understanding before moving on

## Task Progress
See PLAN.md for the full task checklist.

## Key Security Concepts to Reinforce
- **Checks-Effects-Interactions pattern** (Task 2): always update state before transferring ETH
- **Use `.call` not `.transfer`** for ETH sends (gas limit reasons)
- **Events** are the standard way to track history on-chain (Task 5)
- Smart contracts are **immutable once deployed on mainnet** — tests matter

## Project Structure
```
contracts/Bank.sol          # The smart contract
test/Bank.ts                # Unit tests
ignition/modules/Bank.ts    # Hardhat Ignition deployment module
scripts/deploy.ts           # Standalone ethers.js deploy script
scripts/demo.ts             # Automated interaction demo
scripts/connect.ts          # External connection + history script
ui/index.html               # Vue 3 frontend (Task 14)
```

## Common Commands
```bash
npx hardhat compile
npx hardhat test
npx hardhat node
npx hardhat ignition deploy ignition/modules/Bank.ts --network localhost
npx hardhat run scripts/demo.ts --network localhost
npx hardhat run scripts/connect.ts --network localhost
npx hardhat console --network localhost
```
