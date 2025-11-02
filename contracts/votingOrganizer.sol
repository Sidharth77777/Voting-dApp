// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {VotingStorage} from "./votingStorage.sol";
import {VotingModifiers} from  "./votingModifiers.sol";

contract VotingOrganizer is VotingStorage, VotingModifiers {
    // ============================
    // Organizer Functions
    // ============================

    /// @dev Change the organizer of the contract
    function changeOwner(address _addr) external onlyOwner {
        votingOrganizer = _addr;
        emit ChangeOrganizer(msg.sender, _addr);
    }

    /// @dev Create a new group with start and end times
    function createGroup(string calldata _name, string calldata _image, string calldata _ipfs, bool _requiresRegisteredVoters, uint _startTime, uint _endTime, string calldata _description) external onlyOwner {
        require(_startTime < _endTime, "Start time must be before end time!");
        require(_endTime > block.timestamp, "End time must be in the future!");

        groupId++;
        Group storage newGroup = groups[groupId];
        newGroup.id = groupId;
        newGroup.name = _name;
        newGroup.image = _image;
        newGroup.ipfs = _ipfs;
        newGroup.requiresRegisteredVoters = _requiresRegisteredVoters;
        newGroup.exists = true;
        newGroup.startTime = _startTime;
        newGroup.endTime = _endTime;
        newGroup.description = _description;

        emit GroupCreated(groupId, _name, _requiresRegisteredVoters, _startTime, _endTime);
    }

    /// @dev Delete a group and reset candidate mappings
    function deleteGroup(uint _groupId) external onlyOwner {
        require(groups[_groupId].exists, "No group exists!");
        
        address[] storage groupCandidates = groups[_groupId].candidates;
        for (uint i = 0; i < groupCandidates.length; i++) {
            groups[_groupId].candidateExists[groupCandidates[i]] = false;
            groups[_groupId].votesPerCandidate[groupCandidates[i]] = 0;
        }
        
        delete groups[_groupId];
        emit GroupDeleted(_groupId);
    }

    /// @dev Remove a candidate from a group
	function deleteCandidateFromGroup(uint _groupId, address _candidateAddr) external onlyOwner {
        require(groups[_groupId].exists, "Group does not exist!");
        require(groups[_groupId].candidateExists[_candidateAddr], "Candidate not in this group!");

        groups[_groupId].candidateExists[_candidateAddr] = false;
        delete groups[_groupId].votesPerCandidate[_candidateAddr];

        // Remove candidate from array
        address[] storage groupCandidates = groups[_groupId].candidates;
        for (uint i = 0; i < groupCandidates.length; i++) {
            if (groupCandidates[i] == _candidateAddr) {
                groupCandidates[i] = groupCandidates[groupCandidates.length - 1];
                groupCandidates.pop();
                break;
            }
        }

        emit CandidateRemovedFromGroup(_groupId, _candidateAddr);
    }

    /// @dev Add an approved candidate to a group
    function addCandidateToGroup(uint _groupId, address _candidateAddress) external onlyOwner {
        require(groups[_groupId].exists, "Group doesn't exist!");
        require(candidates[_candidateAddress].candidateAddress != address(0), "Candidate does not exist!");
        require(!groups[_groupId].candidateExists[_candidateAddress], "Candidate already in group!");

        groups[_groupId].candidates.push(_candidateAddress);
        groups[_groupId].candidateExists[_candidateAddress] = true;
        emit AddedCandidateToGroup(_candidateAddress, _groupId);
    }
}