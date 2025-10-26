import { ethers } from "ethers";

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
    setSideBarToggle: (sideBarToggle:boolean) => void;
}