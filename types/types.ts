import { ethers } from "ethers";
import { LucideIcon } from "lucide-react";

export interface Web3ContextType {
    account: string | null;
    setAccount: (account: string | null) => void;
    contract: ethers.Contract | null;
    setContract: (contract: ethers.Contract | null) => void;
    provider: ethers.BrowserProvider | null;
    setProvider: (provider: ethers.BrowserProvider | null) => void;
    balance: string | null;
    setBalance: (balance: string | null) => void;
}

export interface WalletConnectParamsTypes {
    account: string;
    contract: ethers.Contract;
    provider: ethers.BrowserProvider;
}

export interface WithSideBarType extends Web3ContextType {
    sideBarToggle: boolean,
    setSideBarToggle: (sideBarToggle: boolean) => void;
}

export interface CandidateDataType {
    id: number;
    name: string;
    candidateAddress: string;
    age: number;
    image: string;
    ipfs: string;
    voteCount: number;
    exists: boolean;
}

export interface VoterDataType {
    id: number;
    name: string;
    voterAddress: string;
    age: number;
    image: string;
    ipfs: string;
    voteCount: number;
    exists: boolean;
}

export interface SideBarMenuType {
    id: number;
    name: string;
    icon: LucideIcon;
    path: string;
}

export interface WorkFlowType {
    id: number;
    icon: LucideIcon;
    head: string;
    p: string;
}

export interface ListFeaturesType {
    id:number; 
    color: string;
    name: string;    
}

export interface ContextType extends WithSideBarType {
    profile: VoterDataType | null;
    setProfile: (profile: VoterDataType | null) => void;
}

export type ImageCategory = "voter" | "candidate" | "group";

export interface UploadedImageType {
    cid: string;
    url: string;
}

export interface AdminPageProps {
    owner: string;
}

export interface VotersToBeApprovedType{
    name: string;
    voterAddress: string;
    image?: string;
}

export interface CandidatesToBeApprovedType{
    name: string;
    candidateAddress: string;
    image?: string;
}

export interface Group {
  id: bigint;                     
  name: string;                   
  image: string;                  
  ipfs: string;                   
  candidates: string[];           
  requiresRegisteredVoters: boolean;
  exists: boolean;
  startTime: bigint;              
  endTime: bigint;                
  description: string;            
}
