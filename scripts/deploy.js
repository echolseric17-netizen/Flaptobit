/**
 * HARDHAT DEPLOYMENT SCRIPT
 * Deploys all smart contracts to Sepolia testnet
 * Run: npx hardhat run scripts/deploy.js --network sepolia
 */

const hre = require('hardhat');

async function main() {
  console.log('\n🚀 DEPLOYING FLAPTOBIT CONTRACTS...\n');

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`📍 Deploying with account: ${deployer.address}`);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH\n`);

  try {
    // 1. Deploy FLAPToken
    console.log('1️⃣ Deploying FLAPToken...');
    const FLAPToken = await hre.ethers.getContractFactory('FLAPToken');
    const flapToken = await FLAPToken.deploy();
    await flapToken.waitForDeployment();
    const flapAddress = await flapToken.getAddress();
    console.log(`✅ FLAPToken deployed to: ${flapAddress}\n`);

    // 2. Deploy FLAPStakingPool
    console.log('2️⃣ Deploying FLAPStakingPool...');
    const FLAPStakingPool = await hre.ethers.getContractFactory('FLAPStakingPool');
    const stakingPool = await FLAPStakingPool.deploy(flapAddress);
    await stakingPool.waitForDeployment();
    const stakingAddress = await stakingPool.getAddress();
    console.log(`✅ FLAPStakingPool deployed to: ${stakingAddress}\n`);

    // 3. Deploy Platform
    console.log('3️⃣ Deploying Platform...');
    const Platform = await hre.ethers.getContractFactory('Platform');
    const platform = await Platform.deploy(flapAddress);
    await platform.waitForDeployment();
    const platformAddress = await platform.getAddress();
    console.log(`✅ Platform deployed to: ${platformAddress}\n`);

    // 4. Save deployment addresses to .env
    const fs = require('fs');
    const envContent = `
VITE_FLAP_TOKEN_ADDRESS=${flapAddress}
VITE_FLAP_STAKING_POOL_ADDRESS=${stakingAddress}
VITE_PLATFORM_ADDRESS=${platformAddress}
VITE_NETWORK=sepolia
VITE_CHAIN_ID=11155111
`;

    fs.appendFileSync('.env', envContent);
    console.log('📝 Addresses saved to .env\n');

    // 5. Display summary
    console.log('═════════════════════════════════════════════════════════════');
    console.log('✅ DEPLOYMENT SUCCESSFUL!');
    console.log('═════════════════════════════════════════════════════════════\n');
    console.log('📋 CONTRACT ADDRESSES:\n');
    console.log(`FLAPToken:        ${flapAddress}`);
    console.log(`FLAPStakingPool:  ${stakingAddress}`);
    console.log(`Platform:         ${platformAddress}\n`);
    console.log('🔗 View on Sepolia Etherscan:');
    console.log(`https://sepolia.etherscan.io/address/${flapAddress}`);
    console.log(`https://sepolia.etherscan.io/address/${stakingAddress}`);
    console.log(`https://sepolia.etherscan.io/address/${platformAddress}\n`);

  } catch (error) {
    console.error('❌ DEPLOYMENT FAILED:\n', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
