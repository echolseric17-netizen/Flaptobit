// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title FLAPStakingPool
 * @dev Manages staking of FLAP tokens and reward distribution
 * Users stake FLAP to:
 * - Earn governance power
 * - Receive protocol rewards
 * - Unlock exclusive benefits
 */
contract FLAPStakingPool is Ownable, ReentrancyGuard {
    IERC20 public flapToken;
    
    // Staking parameters
    uint256 public minimumStake = 100 * 10 ** 18; // 100 FLAP minimum
    uint256 public rewardRate = 5; // 5% APY
    uint256 public totalStaked = 0;
    
    // Staker info
    struct Staker {
        uint256 amount;
        uint256 stakedAt;
        uint256 rewardsClaimed;
    }
    
    mapping(address => Staker) public stakers;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardRateUpdated(uint256 newRate);

    constructor(address _flapToken) {
        flapToken = IERC20(_flapToken);
    }

    /**
     * @dev Stake FLAP tokens
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount >= minimumStake, "Below minimum stake");
        require(flapToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        stakers[msg.sender].amount += amount;
        stakers[msg.sender].stakedAt = block.timestamp;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Unstake FLAP tokens
     */
    function unstake(uint256 amount) external nonReentrant {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount >= amount, "Insufficient staked amount");
        
        // Claim pending rewards first
        uint256 rewards = calculateRewards(msg.sender);
        if (rewards > 0) {
            staker.rewardsClaimed += rewards;
            require(flapToken.transfer(msg.sender, rewards), "Reward transfer failed");
            emit RewardsClaimed(msg.sender, rewards);
        }
        
        staker.amount -= amount;
        totalStaked -= amount;
        require(flapToken.transfer(msg.sender, amount), "Unstake transfer failed");
        
        emit Unstaked(msg.sender, amount);
    }

    /**
     * @dev Calculate pending rewards for a staker
     */
    function calculateRewards(address staker) public view returns (uint256) {
        Staker storage s = stakers[staker];
        if (s.amount == 0) return 0;
        
        uint256 stakingDuration = block.timestamp - s.stakedAt;
        uint256 yearInSeconds = 365 days;
        uint256 rewards = (s.amount * rewardRate * stakingDuration) / (100 * yearInSeconds);
        
        return rewards;
    }

    /**
     * @dev Claim accumulated rewards
     */
    function claimRewards() external nonReentrant {
        uint256 rewards = calculateRewards(msg.sender);
        require(rewards > 0, "No rewards to claim");
        
        stakers[msg.sender].rewardsClaimed += rewards;
        stakers[msg.sender].stakedAt = block.timestamp;
        
        require(flapToken.transfer(msg.sender, rewards), "Reward transfer failed");
        emit RewardsClaimed(msg.sender, rewards);
    }

    /**
     * @dev Get staker info
     */
    function getStaker(address user) external view returns (uint256 amount, uint256 stakedAt, uint256 rewardsClaimed) {
        Staker storage s = stakers[user];
        return (s.amount, s.stakedAt, s.rewardsClaimed);
    }

    /**
     * @dev Update reward rate (owner only)
     */
    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 100, "Rate too high");
        rewardRate = newRate;
        emit RewardRateUpdated(newRate);
    }

    /**
     * @dev Set minimum stake amount (owner only)
     */
    function setMinimumStake(uint256 newMinimum) external onlyOwner {
        minimumStake = newMinimum;
    }
}
