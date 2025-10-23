// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {VotingStorage} from "./votingStorage.sol";

contract VotingModifiers is VotingStorage {
    function _onlyOwner() private view {
        require(msg.sender == votingOrganizer, "Only organizer can do it!");
    }

    function _onlyDuringVoting(uint _groupId) private view {
        require(groups[_groupId].exists, "Group does not exist!");
        require(block.timestamp >= groups[_groupId].startTime, "Voting not started yet!");
        require(block.timestamp <= groups[_groupId].endTime, "Voting ended!");
    }

    function _onlyAfterVoting(uint _groupId) private view {
        require(groups[_groupId].exists, "Group does not exist!");
        require(groups[_groupId].candidates.length > 0, "No candidates in this group!");
        require(block.timestamp > groups[_groupId].endTime, "Voting hasn't ended yet!");
    }

    // ============================
    // Modifiers
    // ============================

    /// @dev Only voting organizer can call functions with this modifier
    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    /// @dev Only allows actions during voting period
    modifier onlyDuringVoting(uint _groupId) {
        _onlyDuringVoting(_groupId);
        _;
    }

    /// @dev Only allows actions after voting has ended
    modifier onlyAfterVoting(uint _groupId) {
        _onlyAfterVoting(_groupId);
        _;
    }
}