// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC721} from "@openzeppelin/token/ERC721/ERC721.sol";

contract NounSwap {
    ERC721 immutable nounsToken;
    address immutable nounsTreasury;

    /// @notice Emitted when a swap occurs
    /// @param sender sender initiating the swap
    /// @param senderNounId senders Noun sent to the treasury
    /// @param treasuryNounId treasuries Noun sent to the sender
    event Swap(address indexed sender, uint256 indexed senderNounId, uint256 indexed treasuryNounId);

    /// @param _nounsToken nouns token
    /// @param _nounsTreasury nouns treasury address which holds the treasuries nouns
    constructor(ERC721 _nounsToken, address _nounsTreasury) {
        nounsToken = _nounsToken;
        nounsTreasury = _nounsTreasury;
    }

    /// @notice  Swap senderNounId from msg.sender with treasuryNounId in the Noun's treasury
    /// @dev     msg.sender must approve this contract to transfer senderNounId
    ///          nouns treasury should have setApprovalForAll for this contract (through gouvernance)
    /// @param   senderNounId sender's Noun to transfer to the treasury
    /// @param   treasuryNounId treasury's Noun to transfer to the sender
    function swap(uint256 senderNounId, uint256 treasuryNounId) external {
        // Nouns treasury is a contract, and does not implement IERC721Reciever so must use transferFrom instead of safeTransferFrom
        nounsToken.transferFrom(msg.sender, nounsTreasury, senderNounId);
        nounsToken.safeTransferFrom(nounsTreasury, msg.sender, treasuryNounId);

        emit Swap(msg.sender, senderNounId, treasuryNounId);
    }
}
