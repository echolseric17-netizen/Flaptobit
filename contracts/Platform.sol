// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Platform
 * @dev Main platform contract for managing the hiring marketplace
 * Handles:
 * - Fee collection from placements
 * - Rewards distribution
 * - Treasury management
 * - Platform control
 */
contract Platform is Ownable, ReentrancyGuard {
    IERC20 public flapToken;
    
    // Platform parameters
    uint256 public platformFee = 5; // 5% fee on first month
    uint256 public rewardPoolPercentage = 2; // 2% to reward pool
    uint256 public treasuryPercentage = 3; // 3% to treasury
    
    // Treasury balance
    uint256 public treasuryBalance = 0;
    uint256 public rewardPoolBalance = 0;
    
    // Platform statistics
    uint256 public totalPlacements = 0;
    uint256 public totalFeesCollected = 0;
    uint256 public totalRewardsDistributed = 0;
    
    // Placement record
    struct Placement {
        address employee;
        address employer;
        uint256 placementAmount;
        uint256 feeAmount;
        uint256 timestamp;
        bool active;
    }
    
    mapping(uint256 => Placement) public placements;
    uint256 private placementCounter = 0;
    
    // Events
    event PlacementCreated(uint256 indexed placementId, address indexed employee, address indexed employer, uint256 amount);
    event FeeCollected(uint256 indexed placementId, uint256 feeAmount);
    event RewardDistributed(address indexed recipient, uint256 amount);
    event FeeUpdated(uint256 newFee);
    event TreasuryWithdrawn(address indexed recipient, uint256 amount);

    constructor(address _flapToken) {
        flapToken = IERC20(_flapToken);
    }

    /**
     * @dev Create a new placement (called by FLUX-3 agent or admin)
     */
    function createPlacement(
        address employee,
        address employer,
        uint256 amount
    ) external onlyOwner nonReentrant returns (uint256) {
        require(employee != address(0), "Invalid employee");
        require(employer != address(0), "Invalid employer");
        require(amount > 0, "Invalid amount");
        
        uint256 placementId = placementCounter;
        placementCounter++;
        
        // Calculate fees
        uint256 feeAmount = (amount * platformFee) / 100;
        uint256 rewardAmount = (feeAmount * rewardPoolPercentage) / (rewardPoolPercentage + treasuryPercentage);
        uint256 treasuryAmount = feeAmount - rewardAmount;
        
        // Record placement
        Placement storage placement = placements[placementId];
        placement.employee = employee;
        placement.employer = employer;
        placement.placementAmount = amount;
        placement.feeAmount = feeAmount;
        placement.timestamp = block.timestamp;
        placement.active = true;
        
        // Update balances
        rewardPoolBalance += rewardAmount;
        treasuryBalance += treasuryAmount;
        totalFeesCollected += feeAmount;
        totalPlacements++;
        
        emit PlacementCreated(placementId, employee, employer, amount);
        emit FeeCollected(placementId, feeAmount);
        
        return placementId;
    }

    /**
     * @dev Distribute rewards to employee
     */
    function distributeReward(address recipient, uint256 amount) external onlyOwner nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        require(amount <= rewardPoolBalance, "Insufficient reward pool");
        require(flapToken.transfer(recipient, amount), "Transfer failed");
        
        rewardPoolBalance -= amount;
        totalRewardsDistributed += amount;
        
        emit RewardDistributed(recipient, amount);
    }

    /**
     * @dev Withdraw from treasury (owner only)
     */
    function withdrawFromTreasury(uint256 amount) external onlyOwner nonReentrant {
        require(amount <= treasuryBalance, "Insufficient treasury");
        
        treasuryBalance -= amount;
        // In production, this would be transferred to owner's wallet or redistributed
        emit TreasuryWithdrawn(msg.sender, amount);
    }

    /**
     * @dev Get placement details
     */
    function getPlacement(uint256 placementId) external view returns (
        address employee,
        address employer,
        uint256 amount,
        uint256 fee,
        uint256 timestamp,
        bool active
    ) {
        Placement storage p = placements[placementId];
        return (p.employee, p.employer, p.placementAmount, p.feeAmount, p.timestamp, p.active);
    }

    /**
     * @dev Update platform fee (owner only)
     */
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 10, "Fee too high");
        platformFee = newFee;
        emit FeeUpdated(newFee);
    }

    /**
     * @dev Get platform statistics
     */
    function getStats() external view returns (
        uint256 placements_,
        uint256 feesCollected,
        uint256 rewardsDistributed,
        uint256 treasury,
        uint256 rewardPool
    ) {
        return (
            totalPlacements,
            totalFeesCollected,
            totalRewardsDistributed,
            treasuryBalance,
            rewardPoolBalance
        );
    }
}
