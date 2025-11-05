"use client";
import {
	connectWalletFunction,
	fetchBalanceFunction,
	getProfileFunction,
} from "../context/contractFunctions";
import { ContextType, WalletConnectParamsTypes } from "@/types/types";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";
import { useEffect } from "react";
import Image from "next/image";
import ETH from "./../images/ethereum-original.svg";
import Link from "next/link";
import toast from 'react-hot-toast';
import { PanelLeftClose, PanelRightClose, Wallet } from "lucide-react";
import { IoIosLogOut } from "react-icons/io";
import { Button } from "@/components/ui/button";

export default function Header() {
	const { account, contract, provider, balance, sideBarToggle, setBalance, setAccount, setContract, setProvider, setSideBarToggle, profile, setProfile }: ContextType = useWeb3();

	const fetchProfile = async () => {
		if (!account || !contract) return;

		try {
			const res = await getProfileFunction(contract, account);
			if (typeof res === "string") {
				setProfile(null);
				return;
			}
			setProfile(res);
		} catch (err: any) {
			console.error(err);
		}
	}

	const connectWallet = async (): Promise<void> => {
		const walletConnectParams: WalletConnectParamsTypes | void = await connectWalletFunction();
		if (walletConnectParams) {
			setAccount(walletConnectParams.account);
			setContract(walletConnectParams.contract);
			setProvider(walletConnectParams.provider);
			toast.success("Connected Wallet Successfully")
		} else {
			toast((t) => (
				<span>
					Install<b> Metmask</b> first! 
					<button
					className="bg-green-400 hover:bg-green-500 cursor-pointer text-black px-2 py-1 rounded text-sm font-medium transition ml-2"
					onClick={() => {
						window.open(
						"https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
						"_blank"
						);
						toast.dismiss(t.id);
					}}
					>
      				Install
    				</button>
				</span>
			));
		}
		return;
	};

	const fetchBalance = async (account: string, provider: ethers.BrowserProvider): Promise<null | void> => {
		if (!account || !provider) return null;
		try {
			const balanceETH = await fetchBalanceFunction(account, provider);
			setBalance(Number(balanceETH)?.toFixed(4));
		} catch (err) {
			console.error("Failed to fetch balance", err);
		}

	};

	const disconnectWallet = (): void => {
		setAccount(null);
		setProfile(null);
		setBalance(null);
		setContract(null);
		setProvider(null);
	};

	useEffect(() => {
		if (!account) {
			setProfile(null);
			setBalance(null);
			setContract(null);
			setProvider(null);
		}
	}, [account]);

	useEffect(() => {
		if (account && provider) {
			fetchBalance(account, provider);
			fetchProfile();
		}
	}, [account, provider, balance]);

	return (
		<header className="sticky top-0 z-50 w-full backdrop-blur-md bg-gray-900/80 text-white shadow-lg border-b border-gray-800">
			<div className="flex relative sm:flex-row flex-col items-center justify-between px-2 py-4 gap-3 sm:gap-0">
				<div className="flex sm:gap-20 gap-3 justify-center items-center">
					<div className="absolute sm:left-3 left-1 sm:top-[30%] top-[58%]">
						{sideBarToggle ?
							<PanelRightClose className="cursor-pointer w-6 h-6 opacity-80" onClick={() => setSideBarToggle(false)} />
							: <PanelLeftClose className="cursor-pointer w-6 h-6 opacity-80" onClick={() => setSideBarToggle(true)} />
						}
					</div>
					<h1 className="text-lg sm:ml-30 sm:text-3xl font-semibold tracking-tight bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
						<Link href="/">Voting DApp</Link>
					</h1>
				</div>

				<div className="flex flex-wrap items-center justify-center gap-1 sm:gap-4">
					{account ? (
						<>
							<span className="sm:px-3 px-1 py-1 font-mono bg-gray-800 rounded-xl text-sm border border-gray-700 shadow-sm hover:bg-gray-700 transition-all">
								{`${account.slice(0, 4)}...${account.slice(-4)}`}
							</span>

							<span className="sm:px-3 px-2 py-1 bg-gray-800 rounded-xl text-sm flex items-center gap-1 border border-gray-700 shadow-sm hover:bg-gray-700 transition-all">
								<Image
									alt="ETH"
									src={ETH}
									width={14}
									height={14}
									className="opacity-80"
								/>
								<p className="font-medium text-cyan-400">{balance}</p>
							</span>

							<Button
								onClick={disconnectWallet}
								className="bg-red-500 cursor-pointer hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm"
							>
								<IoIosLogOut className="w-4 h-4" />
							</Button>
						</>
					) : (
						<Button
							onClick={connectWallet}
							className="bg-linear-to-r cursor-pointer flex justify-center items-center gap-2 bg-[#987eea] hover:bg-[#5021ec] text-white px-5 py-1 rounded-xl font-semibold text-sm transition-all shadow-md"
						>
							Connect Wallet <Wallet className="w-5" />
						</Button>
					)}
				</div>
			</div>
		</header>

	);
}
