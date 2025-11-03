"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { getOwnerFunction } from "../context/contractFunctions";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import ConnectWalletPage from "../_components/ConnectWallet";
import AdminPage from "../_components/AdminPage";

export default function Admin() {
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

	if (!account)
		return <ConnectWalletPage />

	else if (account?.toLowerCase() === owner?.toLowerCase()) 
		return <AdminPage owner={owner} />

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
	);
}
