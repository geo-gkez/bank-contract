# Hardhat Smart Contract Dev Environment

A Solidity development environment running inside Docker, accessed via VS Code Dev Containers.

## Project Structure

```
first-app/
├── .devcontainer/
│   └── devcontainer.json   ← VS Code Dev Container config
├── Dockerfile.dev          ← Node 24 image with dev tools
├── docker-compose.yml      ← Defines dev service with volume mount and port
├── hardhat.config.ts       ← Hardhat configuration
├── contracts/
│   └── Bank.sol            ← Bank smart contract
├── test/
│   └── Bank.ts             ← Unit tests
├── ignition/
│   └── modules/
│       └── Bank.ts         ← Ignition deployment module
├── scripts/
│   ├── deploy.ts           ← Standalone deploy script
│   ├── demo.ts             ← Automated interaction demo
│   └── connect.ts          ← External connection + history script
└── typechain-types/        ← Auto-generated TypeScript types
```

## Prerequisites

- [Docker](https://www.docker.com/)
- [VS Code](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Setup

1. Open the `first-app/` folder in VS Code
2. Open the command palette (`Ctrl+Shift+P`) and run:
   ```
   Dev Containers: Reopen in Container
   ```
3. Wait for the image to build and VS Code to attach to the container

## Verify the Environment

Inside the container terminal:

```bash
node --version   # should show v24.x.x
```

## Hardhat Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start a persistent local blockchain node (port 8545) — keep this running
npx hardhat node

# Deploy Bank contract to the running local node (Ignition)
npx hardhat ignition deploy ignition/modules/Bank.ts --network localhost

# Deploy Bank contract using the standalone script
npx hardhat run scripts/deploy.ts --network localhost

# Run the automated demo (deposit, withdraw, transfer, history)
npx hardhat run scripts/demo.ts --network localhost

# Run the external connection script
npx hardhat run scripts/connect.ts --network localhost

# Open an interactive console connected to the local node
npx hardhat console --network localhost
```

## Interacting via Console

With `npx hardhat node` running in one terminal, open a second terminal and run:

```bash
npx hardhat console --network localhost
```

Example commands:

```javascript
// Connect to deployed Bank contract
const bank = await ethers.getContractAt("Bank", "0x5FbDB2315678afecb367f032d93F642f64180aa3")

// Deposit 1 ETH
await bank.depositFunds({ value: ethers.parseEther("1.0") })

// Check balance
ethers.formatEther(await bank.getBalance())

// Get transaction history
await bank.getTransactionHistory()
```

## Notes

- Source code lives on the host machine and is volume-mounted into the container at `/workspace`
- `node_modules/` persists on the host — no reinstall needed after container restarts
- Port `8545` is exposed for connecting external tools (MetaMask, curl, etc.)
- To connect MetaMask: add custom network `http://127.0.0.1:8545`, chain ID `31337`
- The local blockchain is in-memory — stopping `npx hardhat node` wipes all deployed contracts
