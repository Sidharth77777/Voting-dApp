// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {VotingStorage} from "./votingStorage.sol";
import {VotingModifiers} from  "./votingModifiers.sol";

contract VotingGetters is VotingStorage, VotingModifiers {
    // ============================
    // View / Getter Functions
    // ============================

    function getCandidatesLength() external view returns(uint) {
        return candidateAddresses.length;
    }

    function getCandidateData(address _addr) external view returns(Candidate memory) {
        return candidates[_addr];
    }

    function getVotersLength() external view returns(uint) {
        return voterAddresses.length;
    }

    function getVoterData(address _addr) external view returns(Voter memory) {
        return voters[_addr];
    }

    function getVotersToBeAllowedListLength() public view returns (uint256) {
        return votersToBeAllowedList.length;
    }

    function getCandidatesToBeAllowedListLength() public view returns (uint256) {
        return candidatesToBeAllowedList.length;
    }

    // ============================
    // Image / Metadata Updates
    // ============================
    function updateVoterImage(string memory _newImage, string memory _newIpfs) external {
        require(voters[msg.sender].exists, "You are not a registered voter!");
        voters[msg.sender].image = _newImage;
        voters[msg.sender].ipfs = _newIpfs;
        emit ImageUpdated(msg.sender, _newImage, _newIpfs);
    }

    function updateCandidateImage(string memory _newImage, string memory _newIpfs) external {
        require(candidates[msg.sender].exists, "You are not a registered candidate!");
        candidates[msg.sender].image = _newImage;
        candidates[msg.sender].ipfs = _newIpfs;
        emit ImageUpdated(msg.sender, _newImage, _newIpfs);
    }

    function updateGroupImage(uint _groupId, string memory _newImage, string memory _newIpfs) external onlyOwner {
        require(groups[_groupId].exists, "No such group!");
        groups[_groupId].image = _newImage;
        groups[_groupId].ipfs = _newIpfs;
        emit GroupImageUpdated(_groupId, _newImage, _newIpfs);
    }
}