"use client"
import { connectWalletFunction, fetchBalanceFunction } from "../context/contractFunctions";
import { Web3ContextType, WalletConnectParamsTypes } from "@/types/types";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";
import { useEffect } from "react";

export default function Header() {
	const { account, provider, setBalance, setAccount, setContract, setProvider }: Web3ContextType= useWeb3();

	const connectWallet = async (): Promise<void> => {
		const walletConnectParams:(WalletConnectParamsTypes | void) = await connectWalletFunction();
		if (walletConnectParams) {
			setAccount(walletConnectParams.account);
			setContract(walletConnectParams.contract);
			setProvider(walletConnectParams.provider);
		}
		return;
	};

	const fetchBalance = async(account:string, provider:ethers.BrowserProvider): Promise<null | void> => {
		if (!account || !provider) return null;

		const balanceETH = await fetchBalanceFunction(account, provider);
		setBalance(Number(balanceETH)?.toFixed(4));
	}

	const disconnectWallet = (): void => {
		setBalance(null);
		setAccount(null);
		setContract(null);
		setProvider(null);
	}

	useEffect(() => {
		if (account && provider) {
			fetchBalance(account, provider);
		}
	},[account, provider])
	
	return (
		<header>
			<h1>My DApp Header</h1>
			<button onClick={connectWallet} className="cursor-pointer bg-green-500">Connect Wallet</button>
			{account && <span>{`${account.slice(0,6)}...${account.slice(-4)}`}</span>}
			<button onClick={disconnectWallet} className="cursor-pointer bg-red-500">LogOut</button>
		</header>
	);
}
