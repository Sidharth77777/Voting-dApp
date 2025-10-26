import { ethers } from "ethers";
import { ABI, PROXY_CONTRACT_ADDRESS } from "./constants";
import { WalletConnectParamsTypes, CandidateDataType, VoterDataType } from "@/types/types";

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

export const changeOwnerFunction = async(contract:ethers.Contract, address:string): Promise<string> => {
    // if(!account || !contract) return;
    if (!address) return 'No address provided !';

    try{
        if (!ethers.isAddress(address)) {
            return 'Invalid Ethereum address !';
        }

        const tx = await contract.changeOwner(address);
        await tx.wait();
        
        return 'success';
    } catch (error:any) {
        console.error("Error changing owner !", error);
        if (error.reason === "Only organizer can do it!") return "Only organizer can do it !";

        return "Something went wrong !";
        // Toast msg frontend
    }
}

export const createGroupFunction = async (contract: ethers.Contract, name: string, image: string, ipfs: string, requiresRegisteredVoters: boolean, startDate: string, endDate: string): Promise<string> => {
    //if(!account || !contract) return;
    // e.g. "2025-10-31T15:00Z"
    if (!name) return "Group name is mandatory!";
    try {
        const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
        const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
        return "Invalid date format!";
        }

        if (startTimestamp >= endTimestamp) {
        return "Start time must be before end time!";
        }

        if (endTimestamp <= currentTimestamp) {
        return "End time must be in the future!";
        }

        const tx = await contract.createGroup(name, image, ipfs, requiresRegisteredVoters, startTimestamp, endTimestamp);
        await tx.wait();

        return "success";
    } catch (err: any) {
        console.error("Error creating group!", err);

        if (err?.reason === "Only organizer can do it!") return "Only organizer can do it!";
        if (err?.reason === "Start time must be before end time!") return "Start time must be before end time!";
        if (err?.reason === "End time must be in the future!") return "End time must be in the future!";

        return "Something went wrong while creating the group!";
    }
};

export const deleteGroupFunction = async(contract:ethers.Contract, groupId:number): Promise<string> => {
    //if(!account || !contract) return;
    if (!groupId) return 'No group ID provided !';

    try{
        const tx = await contract.deleteGroup(groupId);
        await tx.wait();

        return 'success'
    } catch (err:any) {
        console.error("Error creating group!", err);

        if (err?.reason === "Only organizer can do it!") return "Only organizer can do it!";
        if (err?.reason === "No group exists!") return "No group exists!";

        return "Something went wrong while deleting the group!";
    }
}

export const deleteCandidateFromGroupFunction = async(contract:ethers.Contract, groupId:number, candidateAddress:string): Promise<string> => {
    //if(!account || !contract) return;
    if (!groupId) return 'No group ID provided !';
    if (!candidateAddress) return 'No address provided !'
    if (!ethers.isAddress(candidateAddress)) return 'Invalid Ethereum address !';

    try{
        const tx = await contract.deleteCandidateFromGroup(groupId, candidateAddress);
        await tx.wait();

        return 'success';
    } catch(err:any) {
        console.error("Error deleting candidate from group!", err);

        if (err?.reason === "Only organizer can do it!") return "Only organizer can do it!";
        if (err?.reason === "Group does not exist!") return "Group does not exist!";
        if (err?.reason === "Candidate not in this group!") return "Candidate not in this group!";

        return "Something went wrong while deleting candidate from the group!";
    }
}

export const addCandidateToGroupFunction = async(contract:ethers.Contract, groupId:number, candidateAddress:string): Promise<string> => {
    //if(!account || !contract) return;
    if (!groupId) return 'No group ID provided !';
    if (!candidateAddress) return 'No address provided !'
    if (!ethers.isAddress(candidateAddress)) return 'Invalid Ethereum address !';

    try {
        const tx = await contract.addCandidateToGroup(groupId, candidateAddress);
        await tx.wait();

        return 'success';
    } catch(err:any) {
        console.error("Error adding candidate to the group!", err);

        if (err?.reason === "Only organizer can do it!") return "Only organizer can do it!";
        if (err?.reason === "Group doesn't exist!") return "Group doesn't exist!";
        if (err?.reason === "Candidate does not exist!") return "Candidate does not exist!";
        if (err?.reason === "Candidate already in group!") return "Candidate already in group!";

        return "Something went wrong while adding candidate to the group!";
    }
}

// GETTER FUNCTIONS
export const getCandidatesLengthFunction = async(contract:ethers.Contract): Promise<number> => {
    //if(!account || !contract) return;

    try {
        const candidatesLengthInWei: ethers.BigNumberish = await contract.getCandidatesLength();
        const candidatesLength: number = Number(candidatesLengthInWei);

        return candidatesLength;
    } catch(err:any) {
        console.error("Error getting length of candidates !", err);

        return 0;
    }
}

export const getCandidateDataFunction = async(contract:ethers.Contract, candidateAddress:string): Promise<CandidateDataType |string> => {
    //if(!account || !contract) return;
    if (!candidateAddress) return 'No address provided !';
    if (!ethers.isAddress(candidateAddress)) return 'Invalid Ethereum address !';

    try {
        const data = await contract.getCandidateData(candidateAddress);
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

export const getVotersLengthFunction = async(contract:ethers.Contract): Promise<number> => {
    //if (!account || !contract) return;

    try {
        const votersLengthInWei: ethers.BigNumberish = await contract.getVotersLength();
        const votersLength: number = Number(votersLengthInWei);

        return votersLength;
    } catch(err:any) {
        console.error("Error getting voters length !");

        return 0;
    }
}

export const getVoterDataFunction = async(contract:ethers.Contract, address:string): Promise<VoterDataType | string> => {
    // if(!account || !contract) return;
    if (!address) return 'No address provided !';
    if (!ethers.isAddress(address)) return 'Invalid Ethereum address !';

    try {
        const data = await contract.getVoterData(address);
        const voterData: VoterDataType = {
            id: data.id,
            name: data.name,
            voterAddress: data.voterAddress,
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