"use client"
import ConnectWalletPage from "@/app/_components/ConnectWallet";
import CreatePoll from "@/app/_components/CreatePoll";
import { getOwnerFunction } from "@/app/context/contractFunctions";
import { useWeb3 } from "@/app/context/Web3Context"
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";

export default function CreatePollPage() {
    const { account, contract } = useWeb3();
    const [owner, setOwner] = useState<string | null>(null);

    const getOwner = async (): Promise<void> => {
        if (!account || !contract) return;

        try {
            const ownerOfContract = await getOwnerFunction(contract);

            setOwner(ownerOfContract);
        } catch (err: any) {
            console.error("Error getting Owner of contract!", err);
        }
    };

    useEffect(() => {
        if (account && contract) getOwner();
    }, [account, contract]);

    const fade = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    if (!owner || !contract) return <ConnectWalletPage />

    else if (account && (ethers.getAddress(owner) === ethers.getAddress(account))) return <CreatePoll />

    else return (
        <motion.div
            variants={fade}
            initial="hidden"
            animate="visible"
            className="flex min-h-screen flex-col items-center justify-center h-[80vh] text-center"
        >
            <LockKeyhole className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-red-400 mb-2">Access Denied</h1>
            <p className="text-gray-400 max-w-md">
                Only the contract owner can access this page. Please switch to the
                admin wallet or contact the system administrator.
            </p>
        </motion.div>
    )
}