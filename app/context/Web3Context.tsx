"use client"

import { createContext, useContext, ReactNode, useState } from "react";
import { ethers } from "ethers";
import { VoterDataType, WithSideBarType, ContextType } from "@/types/types";

const Web3Context = createContext<ContextType | undefined>(undefined);

export const Web3Provider = ({children} : {children: ReactNode}) => {
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [sideBarToggle, setSideBarToggle] = useState<boolean>(true);
    const [profile, setProfile] = useState<VoterDataType | null>(null);

    const values: ContextType = {
        account, setAccount,
        contract, setContract,
        provider, setProvider,
        balance, setBalance,
        sideBarToggle, setSideBarToggle,
        profile, setProfile,
    };

    return (
        <Web3Context.Provider value={values}>
            {children}
        </Web3Context.Provider>
    )
}

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (!context) throw new Error("useWeb3 hook must be used within a Web3Provider");
    return context;
}