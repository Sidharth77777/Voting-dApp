// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VotingStorage {
    /// @notice Events for frontend tracking
    event ChangeOrganizer(address prevOrganizer, address indexed newOrganizer);
    event CandidateCreated(address indexed addr, string indexed name);
    event VoterCreated(address indexed addr, string indexed name);
    event Voted(address indexed voter, address indexed candidate, uint indexed groupId);
    event GroupCreated(uint indexed groupId, string name, bool indexed requiresRegisteredVoters, uint startTime, uint endTime);
    event AddedCandidateToGroup(address indexed candidate, uint groupId);
    event ImageUpdated(address indexed user, string newImage, string newIpfs); 
    event GroupImageUpdated(uint indexed groupId, string newImage, string newIpfs);
    event CandidateRemovedFromGroup(uint indexed groupId, address indexed candidateAddr);
    event GroupDeleted(uint indexed groupId);

    uint public totalVotes;
    uint public voterId;
    uint public candidateId;
    uint public groupId;

    address public votingOrganizer;

    // Arrays of addresses for easier batch fetching
    address[] public candidateAddresses;
    address[] public voterAddresses;

    // Mappings for candidates and voters
    mapping(address => Candidate) public candidates;
    mapping(address => Voter) public voters;

    mapping(address => mapping(uint => bool)) public hasVotedInGroup;

    uint public votersToBeAllowedId;
    uint public candidatesToBeAllowedId;
    mapping(address => Voter) public votersToBeAllowed;
    mapping(address => Candidate) public candidatesToBeAllowed;

    mapping(uint => Group) public groups;

    /// @notice Structures
    struct Candidate {
        uint id;
        string name;
        address candidateAddress;
        uint8 age;
        string image;
        string ipfs;
        uint voteCount;
        bool exists;
    }
	struct Voter {
        uint id;
        string name;
        address voterAddress;
        uint8 age;
        string image;
        string ipfs;
        uint voteCount;
        bool exists;
    }
    struct Group {
        uint id;
        string name;
        string image;
        string ipfs;
        address[] candidates;
        mapping(address => bool) candidateExists;
        mapping(address => uint) votesPerCandidate;
        bool requiresRegisteredVoters;
        bool exists;
        uint startTime;
        uint endTime;
        string description;
    }
}