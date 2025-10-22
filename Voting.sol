// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Voting Contract
/// @author Sidharth K S
/// @notice A smart contract for creating voting groups, registering candidates and voters, and conducting time-bound elections.
/// @dev GitHub: https://github.com/Sidharth77777
contract Voting {

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
        uint age;
        string image;
        string ipfs;
        uint voteCount;
        bool exists;
    }
	struct Voter {
        uint id;
        string name;
        address voterAddress;
        uint age;
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
    }

    // ============================
    // Modifiers
    // ============================

    /// @dev Only voting organizer can call functions with this modifier
    modifier onlyOwner() {
        require(msg.sender == votingOrganizer, "Only organizer can do it!");
        _;
    }

    /// @dev Only allows actions during voting period
    modifier onlyDuringVoting(uint _groupId) {
        require(groups[_groupId].exists, "Group does not exist!");
        require(block.timestamp >= groups[_groupId].startTime, "Voting not started yet!");
        require(block.timestamp <= groups[_groupId].endTime, "Voting ended!");
        _;
    }

    /// @dev Only allows actions after voting has ended
    modifier onlyAfterVoting(uint _groupId) {
        require(groups[_groupId].exists, "Group does not exist!");
        require(groups[_groupId].candidates.length > 0, "No candidates in this group!");
        require(block.timestamp > groups[_groupId].endTime, "Voting hasn't ended yet!");
        _;
    }

    // ============================
    // Constructor
    // ============================
    constructor() {
        votingOrganizer = msg.sender;
    }

    // ============================
    // Organizer Functions
    // ============================

    /// @dev Change the organizer of the contract
    function changeOwner(address _addr) external onlyOwner {
        votingOrganizer = _addr;
        emit ChangeOrganizer(msg.sender, _addr);
    }

    /// @dev Create a new group with start and end times
    function createGroup(
        string calldata _name,
        string calldata _image,
        string calldata _ipfs,
        bool _requiresRegisteredVoters,
        uint _startTime,
        uint _endTime
    ) external onlyOwner {
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

    // ============================
    // Candidate Management
    // ============================

    /// @dev Create a candidate directly
    function createCandidate(
        string memory _name,
        address _addr,
        uint _age,
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
        uint _age,
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
        uint _age,
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
        require(groups[_groupId].candidateExists[_candidateAddress], "Candidate not in this group!");
        require(!hasVotedInGroup[msg.sender][_groupId], "Already voted in this group!");

        Candidate storage candidate = candidates[_candidateAddress];
        require(msg.sender != _candidateAddress, "You cannot vote for yourself!");

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

    // ============================
    // View / Getter Functions
    // ============================

    function getCandidatesAddresses() external view returns(address[] memory) {
        return candidateAddresses;
    }

    function getCandidatesLength() external view returns(uint) {
        return candidateAddresses.length;
    }

    function getCandidateData(address _addr) external view returns(Candidate memory) {
        return candidates[_addr];
    }

    function getCandidatesByGroupBatch(uint _groupId, uint start, uint count) external view returns(Candidate[] memory) {
        require(groups[_groupId].exists, "Group does not exist!");
        address[] storage candidateAddrs = groups[_groupId].candidates;
        uint end = start + count > candidateAddrs.length ? candidateAddrs.length : start + count;

        Candidate[] memory batch = new Candidate[](end - start);
        for (uint i = start; i < end; i++) {
            batch[i - start] = candidates[candidateAddrs[i]];
        }
        return batch;
    }

    function getVotersAddresses() external view returns(address[] memory) {
        return voterAddresses;
    }

    function getVotersLength() external view returns(uint) {
        return voterAddresses.length;
    }

    function getVoterData(address _addr) external view returns(Voter memory) {
        return voters[_addr];
    }

    function getVotersBatch(uint start, uint count) external view returns (Voter[] memory) {
        uint end = start + count > voterAddresses.length ? voterAddresses.length : start + count;
        Voter[] memory batch = new Voter[](end - start);
        for (uint i = start; i < end; i++) {
            batch[i - start] = voters[voterAddresses[i]];
        }
        return batch;
    }

    /// @dev Get winner of a group (after voting ends)
    function getWinnerInGroup(uint _groupId) external view onlyAfterVoting(_groupId) returns (Candidate memory, bool) {
        bool isTie = false;
        address winnerAddr = groups[_groupId].candidates[0];
        uint highestVotes = groups[_groupId].votesPerCandidate[winnerAddr];

        for (uint i = 1; i < groups[_groupId].candidates.length; i++) {
            address candidateAddr = groups[_groupId].candidates[i];
            uint candidateVotes = groups[_groupId].votesPerCandidate[candidateAddr];

            if (candidateVotes > highestVotes) {
                winnerAddr = candidateAddr;
                highestVotes = candidateVotes;
                isTie = false;
            } else if (candidateVotes == highestVotes) {
                isTie = true;
            }
        }

        return (candidates[winnerAddr], isTie);
    }
}
