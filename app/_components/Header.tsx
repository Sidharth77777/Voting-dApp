"use client";
import {
  connectWalletFunction,
  fetchBalanceFunction,
} from "../context/contractFunctions";
import { WalletConnectParamsTypes, WithSideBarType } from "@/types/types";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";
import { useEffect } from "react";
import Image from "next/image";
import ETH from "./../images/ethereum-original.svg";
import Link from "next/link";
import { useToast } from "./Toast";
import { PanelLeftClose, PanelRightClose } from "lucide-react";

export default function Header() {
  const {account, provider, balance,sideBarToggle, setBalance, setAccount, setContract, setProvider, setSideBarToggle}: WithSideBarType = useWeb3();
  let {showToast} = useToast();

  const connectWallet = async (): Promise<void> => {
    const walletConnectParams: WalletConnectParamsTypes | void = await connectWalletFunction();
    if (walletConnectParams) {
      setAccount(walletConnectParams.account);
      setContract(walletConnectParams.contract);
      setProvider(walletConnectParams.provider);
	  showToast("Connected Wallet Successfully !");
    } else {
		showToast(
			<div className="flex items-center justify-between gap-2">
				<span>Install MetaMask first!</span>
					<a
					href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
					target="_blank"
					rel="noopener noreferrer"
					className="bg-green-400 hover:bg-green-500 text-black px-2 py-1 rounded text-sm font-medium transition"
					>
					Install
					</a>
			</div>
		);
	}
    return;
  };

  const fetchBalance = async (account: string, provider: ethers.BrowserProvider): Promise<null | void> => {
    if (!account || !provider) return null;

    const balanceETH = await fetchBalanceFunction(account, provider);
    setBalance(Number(balanceETH)?.toFixed(4));
  };

  const disconnectWallet = (): void => {
    setBalance(null);
    setAccount(null);
    setContract(null);
    setProvider(null);
  };

  useEffect(() => {
    if (account && provider) {
      fetchBalance(account, provider);
    }
  }, [account, provider, balance]);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-gray-900/80 text-white shadow-lg border-b border-gray-800">
      <div className="flex relative sm:flex-row flex-col items-center justify-between px-2 py-4 gap-3 sm:gap-0">
        <div className="flex sm:gap-20 gap-3 justify-center items-center">
        <div className="absolute left-0 top-[50%]">
          {sideBarToggle ? 
            <PanelRightClose className="cursor-pointer opacity-80" onClick={() => setSideBarToggle(!sideBarToggle)} /> 
            : <PanelLeftClose className="cursor-pointer opacity-80" onClick={() => setSideBarToggle(!sideBarToggle)} />
          }
        </div>
        <h1 className="text-lg sm:ml-30 sm:text-3xl font-semibold tracking-tight bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
          <Link href="/">Voting DApp</Link>
        </h1>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {account ? (
            <>
              <span className="px-3 py-1 bg-gray-800 rounded-xl text-sm border border-gray-700 shadow-sm hover:bg-gray-700 transition-all">
                {`${account.slice(0, 4)}...${account.slice(-4)}`}
              </span>

              <span className="px-3 py-1 bg-gray-800 rounded-xl text-sm flex items-center gap-1 border border-gray-700 shadow-sm hover:bg-gray-700 transition-all">
                <Image
                  alt="ETH"
                  src={ETH}
                  width={14}
                  height={14}
                  className="opacity-80"
                />
                <p className="font-medium text-cyan-400">{balance}</p>
              </span>

              <button
                onClick={disconnectWallet}
                className="bg-red-500 cursor-pointer hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm"
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-linear-to-r cursor-pointer bg-[#987eea] hover:bg-[#5021ec] text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all shadow-md"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>

  );
}
