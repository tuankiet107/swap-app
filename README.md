## Tech Stack

### Smart Contracts

- **Solidity**
- **Hardhat**
- **TypeScript**

### Frontend

- **Next.js**
- **TypeScript**
- **Wagmi**
- **Viem**
- **Ethereum (Sepolia Testnet)**

---

### Supported Network

- Ethereum Sepolia Testnet

---

## Getting Started

### Project Structure

```text
swap-app/
├── contracts/          # Smart contracts (Solidity)
├── scripts/            # Deployment scripts
├── frontend/           # Next.js Web3 frontend application
├── hardhat.config.ts
└── README.md
```

### 1. Configure environment variables (Root)

Create a `.env` file in the project root and provide the following values:

```env
SEPOLIA_RPC_URL=
PRIVATE_KEY=
ETHERSCAN_API_KEY=
```

### 2. Deploy smart contracts

```
  npx hardhat run scripts/deploy.ts --network sepolia
```

After deployment, copy the deployed contract address from the console output.
This address will be used by the frontend application.

### 3. Configure frontend environment variables

Navigate to the frontend directory and create a .env file:

```
  cd frontend
```

```.env
  NEXT_PUBLIC_ENV=development
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
  NEXT_PUBLIC_SWAP_AMM_CONTRACT_ADDRESS=
  NEXT_PUBLIC_TOKEN_ADDRESS=
```

### 4. Start the frontend application

```
  npm install
  npm run dev
```
