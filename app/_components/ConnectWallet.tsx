"use client";

import { motion } from "framer-motion";
import { useWeb3 } from "../context/Web3Context";
import { Wallet } from "lucide-react";

export default function ConnectWalletPage() {
    const { account } = useWeb3();

    const fade = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    if (!account)
        return (
            <motion.div
                variants={fade}
                initial="hidden"
                animate="visible"
                className="flex min-h-screen flex-col items-center justify-center h-[80vh] text-center"
            >
                <Wallet className="w-16 h-16 text-yellow-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-200 mb-2">
                    Connect Your Wallet
                </h2>
                <p className="text-gray-400 max-w-md">
                    Please connect your wallet to access
                </p>
            </motion.div>
        );
}
