// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {VotingStorage} from "./votingStorage.sol";
import {VotingModifiers} from "./votingModifiers.sol";
import {VotingGetters} from  "./votingGetters.sol";
import {VotingOrganizer} from  "./votingOrganizer.sol";

/// @title Voting Contract
/// @author Sidharth K S
/// @notice A smart contract for creating voting groups, registering candidates and voters, and conducting time-bound elections.
/// @dev GitHub: https://github.com/Sidharth77777

contract Voting is Initializable, VotingStorage, VotingModifiers, VotingGetters, VotingOrganizer {
    // ============================
    // Initialize proxy
    // ============================ 
    function initialize(address _organizer) public initializer {
        votingOrganizer = _organizer;
    }

    // ============================
    // Candidate Management
    // ============================

    /// @dev Create a candidate directly
    function createCandidate(
        string memory _name,
        address _addr,
        uint8 _age,
        string memory _image,
        string memory _ipfs
    ) external onlyOwner {
        require(!candidates[_addr].exists, "Candidate already exists!");
        candidateId++;

        Candidate storage newCandidate = candidates[_addr];
        newCandidate.id = candidateId;
        newCandidate.name = _name;
        newCandidate.candidateAddress = _addr;
        newCandidate.age = _age;
        newCandidate.image = _image;
        newCandidate.ipfs = _ipfs;
        newCandidate.voteCount = 0;
        newCandidate.exists = true;

        emit CandidateCreated(_addr, _name);
    }

    /// @dev Approve candidate after application
    function addCandidateByApproval(address _addr) external onlyOwner {
        require(!candidates[_addr].exists, "Already an approved candidate!");
        Candidate memory appliedCandidate = candidatesToBeAllowed[_addr];

        candidateId++;
        candidates[_addr] = Candidate(
            candidateId,
            appliedCandidate.name,
            _addr,
            appliedCandidate.age,
            appliedCandidate.image,
            appliedCandidate.ipfs,
            0,
            true
        );
        candidateAddresses.push(_addr);

        delete candidatesToBeAllowed[_addr];
        emit CandidateCreated(_addr, appliedCandidate.name);
    }

    // ============================
    // Voter Management
    // ============================

    /// @dev Approve voter after application
    function addVoterByApproval(address _addr) external onlyOwner {
        require(!voters[_addr].exists, "Already an approved voter!");
        Voter memory appliedVoter = votersToBeAllowed[_addr];

        voterId++;
        voters[_addr] = Voter(
            voterId,
            appliedVoter.name,
            _addr,
            appliedVoter.age,
            appliedVoter.image,
            appliedVoter.ipfs,
            0,
            true
        );
        voterAddresses.push(_addr);

        delete votersToBeAllowed[_addr];
        emit VoterCreated(_addr, appliedVoter.name);
    }

    /// @dev Apply to become candidate
    function applyToBeCandidate(
        string memory _name,
        address _addr,
        uint8 _age,
        string memory _image,
        string memory _ipfs
    ) external {
        require(!candidates[_addr].exists, "Already an approved candidate!");
        require(candidatesToBeAllowed[_addr].id == 0, "Already applied!");
        candidatesToBeAllowedId++;
        candidatesToBeAllowed[_addr] = Candidate(candidatesToBeAllowedId, _name, _addr, _age, _image, _ipfs, 0, false);
    }

    /// @dev Apply to become voter
    function applyToBeVoter(
        string memory _name,
        address _addr,
        uint8 _age,
        string memory _image,
        string memory _ipfs
    ) external {
        require(!voters[_addr].exists, "Already an approved voter!");
        require(votersToBeAllowed[_addr].id == 0, "Already applied!");
        votersToBeAllowedId++;
        votersToBeAllowed[_addr] = Voter(votersToBeAllowedId, _name, _addr, _age, _image, _ipfs, 0, false);
    }

    // ============================
    // Voting Functions
    // ============================

    /// @dev Cast vote for a candidate in a group
    function vote(uint _groupId, address _candidateAddress) external onlyDuringVoting(_groupId) {
        //require(groups[_groupId].candidateExists[_candidateAddress], "Candidate not in this group!");
        require(!hasVotedInGroup[msg.sender][_groupId], "Already voted in this group!");

        Candidate storage candidate = candidates[_candidateAddress];
        //require(msg.sender != _candidateAddress, "You cannot vote for yourself!");

        // If group requires registered voters
        if (groups[_groupId].requiresRegisteredVoters) {
            require(voters[msg.sender].exists, "You must be a registered voter!");
            voters[msg.sender].voteCount++;
        }

        candidate.voteCount++;
        groups[_groupId].votesPerCandidate[_candidateAddress]++;
        hasVotedInGroup[msg.sender][_groupId] = true;
        totalVotes++;

        emit Voted(msg.sender, _candidateAddress, _groupId);
    }

}
