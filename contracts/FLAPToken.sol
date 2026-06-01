// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FLAPToken
 * @dev $FLAP Token - Native token for the Flaptobit hiring platform
 * ERC-20 compliant token used for:
 * - Governance of platform parameters
 * - Rewards for successful placements
 * - Staking for protocol sustainability
 * - Fee payment option
 */
contract FLAPToken is ERC20, ERC20Burnable, Ownable {
    // Maximum total supply: 1,000,000 FLAP
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10 ** 18;
    
    // Minting control
    bool public mintingEnabled = true;
    
    // Events
    event MintingDisabled();
    event TokensBurned(uint256 amount);

    /**
     * @dev Constructor - Initial deployment
     * Mints initial supply to the contract owner
     */
    constructor() ERC20("FLAP Token", "FLAP") {
        // Mint 1,000,000 FLAP to owner
        _mint(msg.sender, MAX_SUPPLY);
    }

    /**
     * @dev Mint new tokens (only owner, up to MAX_SUPPLY)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(mintingEnabled, "Minting is disabled");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    /**
     * @dev Permanently disable minting
     */
    function disableMinting() public onlyOwner {
        mintingEnabled = false;
        emit MintingDisabled();
    }

    /**
     * @dev Burn tokens (reduce total supply)
     */
    function burnTokens(uint256 amount) public {
        burn(amount);
        emit TokensBurned(amount);
    }

    /**
     * @dev Decimals (standard: 18)
     */
    function decimals() public view override returns (uint8) {
        return 18;
    }
}
