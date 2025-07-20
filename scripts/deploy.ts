import { ethers } from "hardhat";
import { run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy token
  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("Token deployed at:", tokenAddress);

  // 2. Deploy AMM
  const AMM = await ethers.getContractFactory("SwapTokenAMM");
  const amm = await AMM.deploy(tokenAddress);
  await amm.waitForDeployment();
  const ammAddress = await amm.getAddress();
  console.log("SwapTokenAMM deployed at:", ammAddress);

  // 3. Prepare to add liquidity
  const tokenAmount = ethers.parseUnits("100000", 18);
  const ethAmount = ethers.parseEther("0.1");
  console.log(
    `\nPreparing to add liquidity: ${ethers.formatEther(
      ethAmount
    )} ETH and ${ethers.formatUnits(tokenAmount, 18)} MTK...`
  );

  // 4. Owner approves AMM to spend tokens
  const txApprove = await token.approve(ammAddress, tokenAmount);
  await txApprove.wait();
  console.log("Approved AMM to spend MyToken.");

  // 5. Add liquidity to the AMM
  const txAddLiquidity = await amm.addLiquidity(tokenAmount, {
    value: ethAmount,
  });
  await txAddLiquidity.wait();
  console.log("Liquidity added to the pool.");

  // 6. Display current reserves
  const [tokenReserve, ethReserve] = await amm.getReserves();
  console.log(`\nCurrent reserves:
    - ETH: ${ethers.formatEther(ethReserve)}
    - MTK: ${ethers.formatUnits(tokenReserve, 18)}
  `);

  // 7. Verify contracts on Etherscan
  console.log("\nVerifying contracts...");
  try {
    console.log("Verifying MyToken...");
    await run("verify:verify", {
      address: tokenAddress,
      constructorArguments: [],
    });

    console.log("Verifying SwapTokenAMM...");
    await run("verify:verify", {
      address: ammAddress,
      constructorArguments: [tokenAddress],
    });
    console.log("Contracts verified successfully!");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
