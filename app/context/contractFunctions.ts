import { ethers } from "ethers";
import { ABI, PROXY_CONTRACT_ADDRESS } from "./constants";
import { WalletConnectParamsTypes, CandidateDataType, VoterDataType, VotersToBeApprovedType, CandidatesToBeApprovedType, Group } from "@/types/types";
import { pinata } from '@/pinata/pinataConfig'

export const pinataCheck = async() => {
    if (pinata) console.log('pinata connection successfull')
    else console.log("PINATA ERROR !!!")
}

// WALLET FUNCTIONS
export const connectWalletFunction = async(): Promise<WalletConnectParamsTypes | void > => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    
    try{
        const provider: ethers.BrowserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer: ethers.JsonRpcSigner = await provider.getSigner();
        const contract: ethers.Contract = new ethers.Contract(PROXY_CONTRACT_ADDRESS, ABI, signer);

        const accounts: string[] = await provider.send("eth_requestAccounts", []);
        const account: string = accounts[0];

        await provider.send('wallet_switchEthereumChain', [{ chainId: "0xaa36a7"}]);

        return {account, contract, provider};

    } catch (error: any) {
        if (error.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: "0xaa36a7",
                        chainName: "Sepolia Testnet",
                        rpcUrls: ["https://rpc.sepolia.org"],
                        nativeCurrency: { name: "SepoliaETH", symbol: "SEP", decimals: 18 },
                        blockExplorerUrls: ["https://sepolia.etherscan.io"],
                    },
                ],

            })
        }
        console.error("Error connecting wallet:", error);
        return;
    }
}

export const fetchBalanceFunction = async(account:string, provider:ethers.BrowserProvider): Promise<string | null> => {
    if (!account || !provider) return null;

    try {
        const balanceInWei:bigint = await provider.getBalance(account);
        const balance:string = ethers.formatEther(balanceInWei);

        return balance;
    } catch(error:any) {
        console.error('Error fetching balance :',error);
        return null;
    }

}

// ORGANIZER FUNCTIONS
export const getOwnerFunction = async(contract:ethers.Contract): Promise<string> => {
    //if (!account || !contract) return;
    
    try {
        const owner: string = await contract.votingOrganizer();
        return owner;
    } catch (err:any) {
        console.error("Error getting contract owner !");
        return "Error getting owner of contract !"
    }
}

export const changeOwnerFunction = async(contract:ethers.Contract, address:string): Promise<boolean | string> => {
    // if(!account || !contract) return;
    if (!address) return 'No address provided !';
    if (!ethers.isAddress(address)) return 'Invalid Ethereum address !'

    try{
        const normalisedAddr = ethers.getAddress(address);
        const tx = await contract.changeOwner(normalisedAddr);
        await tx.wait();
        
        return true;
    } catch (err:any) {
        console.error("Error changing owner !", err);

        const reason = err.reason || err.error?.message || err.data?.message || err.message;

        if (reason?.includes("Only organizer can do it!")) return "Only organizer can do it!";
        if (err.code === "ACTION_REJECTED") return "Transaction rejected by user.";
        if (err.code === "INSUFFICIENT_FUNDS") return "Insufficient funds for gas.";

        return "Something went wrong !";
    }
}

export const createGroupFunction = async (contract: ethers.Contract, name: string, image: string, ipfs: string, requiresRegisteredVoters: boolean, startDate: number, endDate: number, description:string): Promise<boolean | string> => {
    //if(!account || !contract) return;
    // e.g. "2025-10-31T15:00Z"
    if (!name) return "Group name is mandatory!";

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (isNaN(startDate) || isNaN(endDate)) return "Invalid date format!";
 
    if (startDate >= endDate) return "Start time must be before end time!";

    if (endDate <= currentTimestamp) return "End time must be in the future!";

    try {
        const tx = await contract.createGroup(name, image, ipfs, requiresRegisteredVoters, startDate, endDate, description);
        await tx.wait();

        return true;
    } catch (err: any) {
        console.error("Error creating group!", err);

        const reason = err.reason || err.error?.message || err.data?.message || err.message;

        if (reason?.includes("Only organizer can do it!")) return "Only organizer can do it!";
        if (reason?.includes("Start time must be before end time!")) return "Start time must be before end time!";
        if (reason?.includes("End time must be in the future!")) return "End time must be in the future!";
        if (err.code === "ACTION_REJECTED") return "Transaction rejected by user.";
        if (err.code === "INSUFFICIENT_FUNDS") return "Insufficient funds for gas.";

        return "Something went wrong while creating the group!";
    }
};

export const deleteGroupFunction = async(contract:ethers.Contract, groupId:number): Promise<boolean | string> => {
    //if(!account || !contract) return;
    if (!groupId) return 'No group ID provided !';

    try{
        const tx = await contract.deleteGroup(groupId);
        await tx.wait();

        return true;
    } catch (err:any) {
        console.error("Error creating group!", err);

        const reason = err.reason || err.error?.message || err.data?.message || err.message;

        if (reason?.includes("Only organizer can do it!")) return "Only organizer can do it!";
        if (reason?.includes("Group doesn't exist!")) return "Group doesn't exist!";
        if (reason?.includes("Candidate does not exist!")) return "Candidate does not exist!";
        if (reason?.includes("Candidate already in group!")) return "Candidate already in group!";
        if (err.code === "ACTION_REJECTED") return "Transaction rejected by user.";
        if (err.code === "INSUFFICIENT_FUNDS") return "Insufficient funds for gas.";

        return "Something went wrong while deleting the group!";
    }
}

export const deleteCandidateFromGroupFunction = async(contract:ethers.Contract, groupId:number, candidateAddress:string): Promise<boolean | string> => {
    //if(!account || !contract) return;
    if (!groupId) return 'No group ID provided !';
    if (!candidateAddress) return 'No address provided !'
    if (!ethers.isAddress(candidateAddress)) return 'Invalid Ethereum address !';

    try{
        const normalisedAddr = ethers.getAddress(candidateAddress);

        const tx = await contract.deleteCandidateFromGroup(groupId, normalisedAddr);
        await tx.wait();

        return true;
    } catch(err:any) {
        console.error("Error deleting candidate from group!", err);

        const reason = err.reason || err.error?.message || err.data?.message || err.message;

        if (reason?.includes("Only organizer can do it!")) return "Only organizer can do it!";
        if (reason?.includes("Group doesn't exist!")) return "Group doesn't exist!";
        if (reason?.includes("Candidate does not exist!")) return "Candidate does not exist!";
        if (err.code === "ACTION_REJECTED") return "Transaction rejected by user.";
        if (err.code === "INSUFFICIENT_FUNDS") return "Insufficient funds for gas.";

        return "Something went wrong while deleting candidate from the group!";
    }
}

export const createCandidateFunction = async(contract:ethers.Contract, name:string, address:string, age:number, image:string, ipfs:string): Promise<boolean | string> => {
    // if (!account || !contract) return;
    if (!name) return "Voter name is mandatory!";
    if (!address) return 'No address provided !';
    if (!ethers.isAddress(address)) return "Invalid Ethereum Address !";
    if (!age || age < 18) return "Age must be between 18 and 120";
    if (age > 120) return "Invalid Age !";

    try{
        const normalisedAddr = ethers.getAddress(address);
        const tx = await contract.createCandidate(name, normalisedAddr, age, image, ipfs);
        await tx.wait();

        return true;
    } catch (err:any) {
        console.error("Error creating candidate !", err);

        const reason = err.reason || err.error?.message || err.data?.message || err.message;

        if (reason?.includes("Only organizer can do it!")) return "Only organizer can do it!";
        if (reason?.includes("Candidate already exists!")) return "Candidate already exists!";
        if (err.code === "ACTION_REJECTED") return "Transaction rejected by user.";
        if (err.code === "INSUFFICIENT_FUNDS") return "Insufficient funds for gas.";

        return "Something went wrong while adding candidate to the group!";
    }
}

export const addCandidateToGroupFunction = async(contract:ethers.Contract, groupId:number, candidateAddress:string): Promise<boolean | string> => {
    //if(!account || !contract) return;
    if (!groupId) return 'No group ID provided !';
    if (!candidateAddress) return 'No address provided !'
    if (!ethers.isAddress(candidateAddress)) return 'Invalid Ethereum address !';

    try {
        const normalisedAddr = ethers.getAddress(candidateAddress);
        const tx = await contract.addCandidateToGroup(groupId, normalisedAddr);
        await tx.wait();

        return true;
    } catch(err:any) {
        console.error("Error adding candidate to the group!", err);

        const reason = err.reason || err.error?.message || err.data?.message || err.message;

        if (reason?.includes("Only organizer can do it!")) return "Only organizer can do it!";
        if (reason?.includes("Group doesn't exist!")) return "Group doesn't exist!";
        if (reason?.includes("Candidate does not exist!")) return "Candidate does not exist!";
        if (reason?.includes("Candidate already in group!")) return "Candidate already in group!";
        if (err.code === "ACTION_REJECTED") return "Transaction rejected by user.";
        if (err.code === "INSUFFICIENT_FUNDS") return "Insufficient funds for gas.";

        return "Something went wrong while adding candidate to the group!";
    }
}

export const addVoterByApprovalFunction = async(contract:ethers.Contract, voterAddress:string): Promise<boolean | string> => {
    // if (!account || !contract) return;
    if (!voterAddress) return 'No address provided !'
    if (!ethers.isAddress(voterAddress)) return 'Invalid Ethereum address !';

    try {
        const normalisedAddr = ethers.getAddress(voterAddress);

        const tx = await contract.addVoterByApproval(normalisedAddr);
        await tx.wait();

        return true;
    } catch (err:any) {
        console.error("Error adding candidate to the group!", err);

        const reason = err.reason || err.error?.message || err.data?.message || err.message;

        if (reason?.includes("Only organizer can do it!")) return "Only organizer can do it!";
        if (reason?.includes("Already an approved voter!")) return "Already an approved voter!";
        if (err.code === "ACTION_REJECTED") return "Transaction rejected by user.";
        if (err.code === "INSUFFICIENT_FUNDS") return "Insufficient funds for gas.";
        return "Something went wrong while approving !"
    }
}

export const addCandidateByApprovalFunction = async(contract:ethers.Contract, candidateAddress:string): Promise<boolean | string> => {
    // if (!account || !contract) return;
    if (!candidateAddress) return 'No address provided !'
    if (!ethers.isAddress(candidateAddress)) return 'Invalid Ethereum address !';

    try {
        const normalisedAddr = ethers.getAddress(candidateAddress);

        const tx = await contract.addCandidateByApproval(normalisedAddr);
        await tx.wait();

        return true;
    } catch (err:any) {
        console.error("Error adding candidate to the group!", err);

        const reason = err.reason || err.error?.message || err.data?.message || err.message;

        if (reason?.includes("Only organizer can do it!")) return "Only organizer can do it!";
        if (reason?.includes("Already an approved candidate!")) return "Already an approved candidate!";
        if (err.code === "ACTION_REJECTED") return "Transaction rejected by user.";
        if (err.code === "INSUFFICIENT_FUNDS") return "Insufficient funds for gas.";
        return "Something went wrong while approving !"
    }
}

// APPLY FUNCTIONS
export const applyToBeVoterFunction = async(contract:ethers.Contract, name:string, address:string, age:number, image:string, ipfs:string): Promise<boolean | string> => {
    // if (!account || !contract) return;
    if (!name) return "Voter name is mandatory!";
    if (!address) return 'No address provided !';
    if (!ethers.isAddress(address)) return "Invalid Ethereum Address !";
    if (!age || age < 18) return "Age must be between 18 and 120";
    if (age > 120) return "Invalid Age !";

    try {
        const normalisedAddr = ethers.getAddress(address);
        const tx = await contract.applyToBeVoter(name, normalisedAddr, age, image, ipfs);
        await tx.wait();

        return true;
    } catch (err:any) {
        console.error('Error while applying',err)

        const reason = err.reason || err.error?.message || err.data?.message || err.message;

        if (reason?.includes("Already an approved voter")) return "Already an approved voter!";
        if (reason?.includes("Already applied")) return "Already applied!";
        if (err.code === "ACTION_REJECTED") return "Transaction rejected by user.";
        if (err.code === "INSUFFICIENT_FUNDS") return "Insufficient funds for gas.";

        return "Something went wrong while applying!";
    }
}

export const applyToBeCandidateFunction = async(contract:ethers.Contract, name:string, address:string, age:number, image:string, ipfs:string): Promise<boolean | string> => {
    // if (!account || !contract) return;
    if (!name) return "Voter name is mandatory!";
    if (!address) return 'No address provided !';
    if (!ethers.isAddress(address)) return "Invalid Ethereum Address !";
    if (!age || age < 18) return "Age must be between 18 and 120";
    if (age > 120) return "Invalid Age !";

    try {
        const normalisedAddr = ethers.getAddress(address);
        const tx = await contract.applyToBeCandidate(name, normalisedAddr, age, image, ipfs);
        await tx.wait();

        return true;
    } catch (err:any) {
        console.error('Error while applying',err)

        const reason = err.reason || err.error?.message || err.data?.message || err.message;

        if (reason?.includes("Already an approved candidate")) return "Already an approved candidate!";
        if (reason?.includes("Already applied")) return "Already applied!";
        if (err.code === "ACTION_REJECTED") return "Transaction rejected by user.";
        if (err.code === "INSUFFICIENT_FUNDS") return "Insufficient funds for gas.";

        return "Something went wrong while applying!";
    }
}

// EDIT FUNCTIONS
export const updateVoterImageFunction = async(contract:ethers.Contract, cid:string, url:string): Promise<string | boolean> => {
    // if (!contract || !account) return;
    if (!url) return "No Image Found"
    if (!cid) return "No CID Found";

    try {
        const tx = await contract.updateVoterImage(url, cid);
        await tx.wait();
        return true;

    } catch (err:any) {
        console.error('Error Updating profile !',err);

        const reason = err.reason || err.error?.message || err.data?.message || err.message;

        if (reason?.includes("You are not a registered voter!")) return "You are not a registered voter!";
        if (err.code === "ACTION_REJECTED") return "Transaction rejected by user.";
        if (err.code === "INSUFFICIENT_FUNDS") return "Insufficient funds for gas.";

        return "Something went wrong while fetching profile !";
    }
}

// GETTER FUNCTIONS
export const getProfileFunction = async(contract:ethers.Contract, account:string): Promise<string | VoterDataType> => {
    // if (!account || !contract) return;
    try {
        const profile = await contract.voters(account);
        const Voter: VoterDataType = {
            id: Number(profile[0]),
            name: profile[1],
            voterAddress: ethers.getAddress(profile[2]),
            age: Number(profile[3]),
            image: profile[4],
            ipfs: profile[5],
            voteCount: Number(profile[6]),
            exists: profile[7],
        }

        return Voter;

    } catch (err:any) {
        console.error('Error fetching profile !',err);
        return "Something went wrong while fetching profile !";
    }
}

export const checkIfAlreadyAppliedToBeVoter = async(contract:ethers.Contract, account:string): Promise<boolean | void> => {
    // if (!account || !contract) return;
    if (!account || !ethers.isAddress(account)) return;

    try {
        const normalisedAddr = ethers.getAddress(account);

        const checker = await contract.votersToBeAllowed(normalisedAddr);

        if (checker && checker.voterAddress === ethers.getAddress(account)) return true;
        else return false;
    } catch (err:any) {
        console.error(err);
        return;
    }
}

export const getCandidatesLengthFunction = async(contract:ethers.Contract): Promise<number | string> => {
    //if(!account || !contract) return;

    try {
        const candidatesLengthInWei: ethers.BigNumberish = await contract.getCandidatesLength();
        const candidatesLength: number = Number(candidatesLengthInWei);

        return candidatesLength;
    } catch(err:any) {
        console.error("Error getting length of candidates !", err);

        return "Error getting length of candidates !";
    }
}

export const getCandidateDataFunction = async(contract:ethers.Contract, candidateAddress:string): Promise<CandidateDataType |string> => {
    //if(!account || !contract) return;
    if (!candidateAddress) return 'No address provided !';
    if (!ethers.isAddress(candidateAddress)) return 'Invalid Ethereum address !';

    try {
        const normalisedAddr = ethers.getAddress(candidateAddress);

        const data = await contract.getCandidateData(normalisedAddr);
        const candidateData: CandidateDataType = {
            id: Number(data.id),
            name: data.name,
            candidateAddress: data.candidateAddress,
            age: Number(data.age),
            image: data.image,
            ipfs: data.ipfs,
            voteCount: Number(data.voteCount),
            exists: data.exists,
        };

        return candidateData;
    } catch(err:any) {
        console.error("Error getting Candidate Data !", err);
        return "Something went wrong while getting candidate data";
    }
}

export const getVotersLengthFunction = async(contract:ethers.Contract): Promise<number | string> => {
    //if (!owner || !contract) return;

    try {
        const votersLengthInWei: ethers.BigNumberish = await contract.getVotersLength();
        const votersLength: number = Number(votersLengthInWei);

        return votersLength;
    } catch(err:any) {
        console.error("Error getting voters length !",err);

        return "Error getting voters length !";
    }
}

export const getTotalPollsLengthFunction = async(contract:ethers.Contract): Promise<number | string> => {
    //if (!owner || !contract) return;

    try {
        const totalGroupId: ethers.BigNumberish = await contract.groupId();
        const totalPolls: number = Number(totalGroupId);

        return totalPolls;
    } catch(err:any) {
        console.error("Error getting total polls !",err);

        return "Error getting total polls length !";
    }
}

// need to optimise
export const getCompletedPollsLengthFunction = async(contract:ethers.Contract): Promise<number | string> => {
    //if (!owner || !contract) return;

    try {
        const totalGroupID: ethers.BigNumberish = await contract.groupId();
        const totalGroups: number = Number(totalGroupID);
        let completedPolls: number = 0;
        const currentTime = Math.floor(Date.now() / 1000);

        for (let i = 0; i <= totalGroups; i++) {
            const group = await contract.groups(i);
            const endTime = Number(group.endTime);

            if (endTime > 0 && endTime < currentTime) {
                completedPolls++
            }
        }

        return completedPolls;
    } catch(err:any) {
        console.error("Error getting completed polls !",err);

        return "Error getting completed polls length !";
    }
}
// this only

export const getGroupsFunction = async(contract:ethers.Contract): Promise<Group[] | boolean> => {
    // if(!account) return false;
    try{
        const totalGroupsBig = await contract.groupId();
        const totalGroups: number = Number(totalGroupsBig);
        const groupsArray: Group[] = [];


        for (let i=0; i <= totalGroups; i++) {
            const group: Group = await contract.groups(i);
            if (group.exists) {
                groupsArray.push(group);
            }
        }
        
        console.log(totalGroups, groupsArray);
        return groupsArray; 

    } catch(err:any) {
        console.error("Error fetching groups !",err);
        return false;
    }
}

export const getTotalVotersToBeApprovedFunction = async(contract:ethers.Contract): Promise<number | string> => {
    // if(!owner || !contract) return;
    try {
        const lengthInWei: ethers.BigNumberish = await contract.getVotersToBeAllowedListLength();
        const length: number = Number(lengthInWei);
        let validCount: number = 0;

        for (let i = 0; i < length; i++) {
            const addr: string = await contract.votersToBeAllowedList(i);
            if (addr != ethers.ZeroAddress) {
                const voter = await contract.votersToBeAllowed(addr);
                if (!(voter.exists) && (voter.voterAddress !== ethers.ZeroAddress)) {
                    validCount++;
                }
            }
        }

        return validCount;
    } catch (err:any) {
        console.error("Error fetching approvable voters length !",err)

        return "Error fetching approvable voters length !";
    }
}

export const getTotalCandidatesToBeApprovedFunction = async(contract:ethers.Contract): Promise<number | string> => {
    // if(!owner || !contract) return;
    try {
        const lengthInWei: ethers.BigNumberish = await contract.getCandidatesToBeAllowedListLength();
        const length: number = Number(lengthInWei);
        let validCount: number = 0;

        for (let i = 0; i < length; i++) {
            const addr: string = await contract.candidatesToBeAllowedList(i);
            if (addr != ethers.ZeroAddress) {
                const candidate = await contract.candidatesToBeAllowed(addr);
                if (!(candidate.exists) && candidate.candidateAddress !== ethers.ZeroAddress) {
                    validCount++
                }
            }
        }

        return validCount;
    } catch (err:any) {
        console.error("Error fetching approvable candidates length !",err)

        return "Error fetching approvable candidates length !";
    }
}

export const getVoterDataFunction = async(contract:ethers.Contract, address:string): Promise<VoterDataType | string> => {
    // if(!account || !contract) return;
    if (!address) return 'No address provided !';
    if (!ethers.isAddress(address)) return 'Invalid Ethereum address !';

    try {
        const normalisedAddr = ethers.getAddress(address);

        const data = await contract.getVoterData(normalisedAddr);
        const voterData: VoterDataType = {
            id: data.id,
            name: data.name,
            voterAddress: ethers.getAddress(data.voterAddress),
            age: data.age,
            image: data.image,
            ipfs: data.string,
            voteCount: data.voteCount,
            exists: data.exists,
        }

        return voterData;
    } catch(err:any) {
        console.error("Error getting voter data !",err);
        return 'Error getting voter data !'
    }
}

export const getVotersToBeAllowedFunction = async(contract:ethers.Contract): Promise<VotersToBeApprovedType[] | string> => {
    // if(!owner || !contract) return;
    try {
        const lengthinWei: ethers.BigNumberish = await contract.getVotersToBeAllowedListLength();
        const length = Number(lengthinWei);
        
        const pendingVoters: VoterDataType[] = [];
        for (let i = 0; i < length; i++){
            const voter: string = await contract.votersToBeAllowedList(i);
            const voterToBeAllowed: VoterDataType = await contract.votersToBeAllowed(ethers.getAddress(voter));
            pendingVoters.push(voterToBeAllowed);
        }

        const formattedVoters: VotersToBeApprovedType[] = pendingVoters
                .filter((voter) => voter.voterAddress && voter.voterAddress !== ethers.ZeroAddress)
                .map((voter) => ({
                    name: voter.name,
                    voterAddress: String(voter.voterAddress),
                    image: voter.image,
        }))

        return formattedVoters;
    } catch (err:any) {
        console.error("Error fetching approvable voters !",err)

        return "Error fetching approvable voters !";
    }
}

export const getCandidatesToBeAllowedFunction = async(contract:ethers.Contract): Promise<CandidatesToBeApprovedType[] | string> => {
    // if(!owner || !contract) return;
    try {
        const lengthinWei: ethers.BigNumberish = await contract.getCandidatesToBeAllowedListLength();
        const length = Number(lengthinWei);
        
        const pendingCandidates: CandidatesToBeApprovedType[] = [];
        for (let i = 0; i < length; i++){
            const candidate: string = await contract.candidatesToBeAllowedList(i);
            const candidateToBeAllowed: CandidateDataType = await contract.candidatesToBeAllowed(ethers.getAddress(candidate));
            pendingCandidates.push(candidateToBeAllowed);
        }

        const formattedCandidate: CandidatesToBeApprovedType[] = pendingCandidates
            .filter((candidate) => candidate.candidateAddress && candidate.candidateAddress !== ethers.ZeroAddress)
            .map((candidate) => ({
                name: candidate.name,
                candidateAddress: String(candidate.candidateAddress),
                image: candidate.image,
        }))

        return formattedCandidate;
    } catch (err:any) {
        console.error("Error fetching approvable candidates !",err)

        return "Error fetching approvable candidates !";
    }
}