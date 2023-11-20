// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {NounSwap} from "../src/NounSwap.sol";
import {ERC721} from "@openzeppelin/token/ERC721/ERC721.sol";

contract NounSwapTest is Test {
    NounSwap public nounSwap;

    ERC721 NOUNS_TOKEN = ERC721(0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03);
    address NOUNS_TREASURY_ADDRESS = 0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71;

    address SENDER_ADDRESS = 0x0B7A4f98e533258CC957f0baF454053ECc6EbdAA;
    uint256 TREASURY_OWNED_NOUN_ID = 912;
    uint256 SENDER_OWNED_NOUN_ID = 12;
    uint256 TREASURY_NOT_OWNED_NOUN_ID = 1;
    uint256 SENDER_NOT_OWNED_NOUN_ID = 20;
    uint256 NON_EXISTENT_NOUN_ID = 50000;

    ////
    // Setup
    ////

    function setUp() public {
        // Fork mainnet
        uint256 mainnetBlockNumber = 18615366;
        uint256 mainnetFork = vm.createFork(vm.envString("MAINNET_RPC_URL"));
        vm.selectFork(mainnetFork);
        vm.rollFork(mainnetBlockNumber);

        // Deploy NounSwap
        nounSwap = new NounSwap(NOUNS_TOKEN, NOUNS_TREASURY_ADDRESS);

        // Prank to be the sender
        vm.startPrank(SENDER_ADDRESS);
    }

    function setNounSwapApprovalForAllFromTreasury() public {
        vm.stopPrank();
        vm.prank(NOUNS_TREASURY_ADDRESS);
        NOUNS_TOKEN.setApprovalForAll(address(nounSwap), true);
        vm.startPrank(SENDER_ADDRESS);
    }

    function setNounSwapApprovalFromSender(uint256 id) public {
        NOUNS_TOKEN.approve(address(nounSwap), id);
    }

    ////
    // Reverting tests
    ////

    function test_Revert_MissingTreasuryApproval() public {
        setNounSwapApprovalFromSender(SENDER_OWNED_NOUN_ID);
        vm.expectRevert("ERC721: transfer caller is not owner nor approved");
        nounSwap.swap(SENDER_OWNED_NOUN_ID, TREASURY_OWNED_NOUN_ID);
    }

    function test_Revert_MissingSenderApproval() public {
        setNounSwapApprovalForAllFromTreasury();
        vm.expectRevert("ERC721: transfer caller is not owner nor approved");
        nounSwap.swap(SENDER_OWNED_NOUN_ID, TREASURY_OWNED_NOUN_ID);
    }

    function test_Revert_TreasuryNotOwner() public {
        setNounSwapApprovalForAllFromTreasury();
        setNounSwapApprovalFromSender(SENDER_OWNED_NOUN_ID);
        vm.expectRevert("ERC721: transfer caller is not owner nor approved");
        nounSwap.swap(SENDER_OWNED_NOUN_ID, TREASURY_NOT_OWNED_NOUN_ID);
    }

    function test_Revert_SenderNotOwner() public {
        setNounSwapApprovalForAllFromTreasury();
        vm.expectRevert("ERC721: transfer of token that is not own");
        nounSwap.swap(SENDER_NOT_OWNED_NOUN_ID, TREASURY_OWNED_NOUN_ID);
    }

    function test_Revert_NonExistantSenderNoun() public {
        setNounSwapApprovalForAllFromTreasury();
        vm.expectRevert("ERC721: operator query for nonexistent token");
        nounSwap.swap(NON_EXISTENT_NOUN_ID, TREASURY_OWNED_NOUN_ID);
    }

    function test_Revert_NonExistantTreasuryNoun() public {
        setNounSwapApprovalFromSender(SENDER_OWNED_NOUN_ID);
        vm.expectRevert("ERC721: operator query for nonexistent token");
        nounSwap.swap(SENDER_OWNED_NOUN_ID, NON_EXISTENT_NOUN_ID);
    }

    ////
    // Passing tests
    ////

    function test_swap() public {
        setNounSwapApprovalForAllFromTreasury();
        setNounSwapApprovalFromSender(SENDER_OWNED_NOUN_ID);
        nounSwap.swap(SENDER_OWNED_NOUN_ID, TREASURY_OWNED_NOUN_ID);
    }
}
