// VAULT-X: Rewards Distribution Agent
// Manages $FLAP token distribution
// Interfaces with FLAPStakingPool.sol
// Status: TRAINING (coming soon)

class VAULTX {
  constructor(apiUrl = 'http://localhost:3000', contractAddress = null) {
    this.apiUrl = apiUrl;
    this.contractAddress = contractAddress; // FLAPStakingPool address
    this.name = 'VAULT-X';
    this.role = 'Rewards Distribution';
    this.status = 'TRAINING';
    this.tasksCompleted = 0;
    this.tokenDistributed = 0;
    this.distributionInterval = 7 * 24 * 60 * 60 * 1000; // Weekly
  }

  /**
   * Calculate rewards for placement
   */
  calculatePlacementReward(placement, rewardPool) {
    // Formula: (Placement Value / Total Placements) * Weekly Pool
    // Bonus: +50% if placement closes in <4 hours
    
    let baseReward = (placement.placementAmount / 10000) * rewardPool;
    
    // Speed bonus
    const closeTime = placement.closedAt - placement.createdAt;
    if (closeTime < 4 * 60 * 60 * 1000) {
      baseReward *= 1.5;
    }
    
    return Math.round(baseReward);
  }

  /**
   * Calculate staking rewards
   */
  async calculateStakingRewards(stakersData) {
    console.log('[VAULT-X] Calculating staking rewards...');
    
    const stakingRewards = {};
    
    for (const staker of stakersData) {
      const stakingDuration = Date.now() - staker.stakedAt;
      const yearInMs = 365 * 24 * 60 * 60 * 1000;
      const reward = (staker.amount * 5 * stakingDuration) / (100 * yearInMs);
      
      stakingRewards[staker.address] = Math.round(reward);
    }
    
    return stakingRewards;
  }

  /**
   * Simulate weekly distribution (for training/testing)
   */
  async simulateWeeklyDistribution() {
    console.log(`\n[${new Date().toISOString()}] [VAULT-X] Simulating weekly distribution...`);
    
    try {
      // In production: connect to FLAPStakingPool contract
      const mockPlacements = [
        { placementAmount: 5000, createdAt: Date.now() - 2 * 60 * 60 * 1000, closedAt: Date.now() },
        { placementAmount: 8000, createdAt: Date.now() - 1 * 60 * 60 * 1000, closedAt: Date.now() }
      ];
      
      const mockStakers = [
        { address: '0x1234...', amount: 1000 * 10 ** 18, stakedAt: Date.now() - 30 * 24 * 60 * 60 * 1000 },
        { address: '0x5678...', amount: 500 * 10 ** 18, stakedAt: Date.now() - 15 * 24 * 60 * 60 * 1000 }
      ];
      
      const weeklyPool = 50000; // 50k FLAP
      
      // Calculate placement rewards
      const placementRewards = {};
      for (const placement of mockPlacements) {
        const reward = this.calculatePlacementReward(placement, weeklyPool * 0.5);
        placementRewards[placement.id] = reward;
      }
      
      // Calculate staking rewards
      const stakingRewards = await this.calculateStakingRewards(mockStakers);
      
      const totalDistributed = 
        Object.values(placementRewards).reduce((a, b) => a + b, 0) +
        Object.values(stakingRewards).reduce((a, b) => a + b, 0);
      
      console.log('[VAULT-X] Weekly Distribution Summary:');
      console.log(`  💎 Placement Rewards: ${Object.values(placementRewards).reduce((a, b) => a + b, 0)} FLAP`);
      console.log(`  📈 Staking Rewards: ${Object.values(stakingRewards).reduce((a, b) => a + b, 0)} FLAP`);
      console.log(`  💰 Total Distributed: ${totalDistributed} FLAP`);
      
      this.tasksCompleted++;
      this.tokenDistributed += totalDistributed;
      
      return {
        placementRewards,
        stakingRewards,
        totalDistributed,
        distributedAt: new Date()
      };
    } catch (error) {
      console.error('[VAULT-X] Distribution error:', error);
    }
  }

  /**
   * Start rewards distribution (when ready)
   */
  start() {
    if (this.status === 'TRAINING') {
      console.log(`⚠️ [VAULT-X] Agent in TRAINING mode`);
      console.log(`📚 Running simulations (not live yet)`);
      
      // Run simulation weekly
      this.simulateWeeklyDistribution();
      this.intervalId = setInterval(
        () => this.simulateWeeklyDistribution(),
        this.distributionInterval
      );
    } else {
      console.log(`✅ [VAULT-X] Rewards Distribution Agent Started`);
      console.log(`💎 Distributing weekly pool of 50,000 FLAP`);
    }
  }

  /**
   * Stop the agent
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.status = 'STOPPED';
      console.log(`⏹️ [VAULT-X] Agent stopped`);
    }
  }

  /**
   * Activate agent (transition from TRAINING to ACTIVE)
   */
  activate(platformContractAddress) {
    this.contractAddress = platformContractAddress;
    this.status = 'ACTIVE';
    console.log(`✅ [VAULT-X] Agent activated with contract: ${platformContractAddress}`);
    this.start();
  }

  /**
   * Get agent stats
   */
  getStats() {
    return {
      name: this.name,
      role: this.role,
      status: this.status,
      tasksCompleted: this.tasksCompleted,
      tokenDistributed: this.tokenDistributed,
      weeklyPool: 50000,
      contractAddress: this.contractAddress || 'Not configured',
      uptime: '—'
    };
  }
}

export default VAULTX;
