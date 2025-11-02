"use client";

import { useWeb3 } from "../context/Web3Context";
import { WalletConnectParamsTypes } from "@/types/types";
import { connectWalletFunction } from "../context/contractFunctions";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function HeroSection() {
  const { account, setAccount, setContract, setProvider } = useWeb3();
  const router: AppRouterInstance = useRouter();

  const connectWallet = async (): Promise<void> => {
    const walletConnectParams: WalletConnectParamsTypes | void = await connectWalletFunction();
    if (walletConnectParams) {
      setAccount(walletConnectParams.account);
      setContract(walletConnectParams.contract);
      setProvider(walletConnectParams.provider);
      toast.success("Connected Wallet Successfully !");
    } else {
      toast(
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

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center text-center px-6 bg-[#0f0f1a] text-[#e2e2f5] relative overflow-hidden"
    >
      <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-[#a48fff]/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 -right-40 w-[25rem] h-[25rem]  blur-[100px] rounded-full"></div>

      <h1 className="font-extrabold leading-tight tracking-tight text-4xl sm:text-5xl lg:text-6xl max-w-3xl z-10">
        Welcome to the Testnet{" "} <br />
        <span className="bg-linear-to-r from-[#a48fff] via-[#7986cb] to-[#64b5f6] text-transparent bg-clip-text">
          Ethereum Based Voting
        </span>{" "}
        <span className="text-[#a48fff]">DApp</span>
      </h1>

      <h3 className="opacity-80 mt-6 mb-10 text-lg sm:text-xl max-w-2xl z-10">
        Secure, decentralized, and transparent voting on the blockchain.{" "}
        <br className="hidden sm:block" />
        Your voice matters in the future of governance.
      </h3>

      <div className="flex flex-wrap gap-4 justify-center z-10">
        <Button
          onClick={connectWallet}
          className="bg-[#a48fff] cursor-pointer hover:bg-[#8265ff] text-[#0f0f1a] font-semibold sm:p-8 p-6 rounded-xl text-lg shadow-lg transition-all flex items-center gap-2"
        >
          Connect <Wallet className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => router.push('/vote')}
          className="bg-transparent cursor-pointer border border-[#a48fff]/40 hover:border-[#a48fff] text-[#e2e2f5] font-semibold sm:p-8 p-6 rounded-xl text-lg shadow-lg transition-all"
        >
          Start Voting
        </Button>
      </div>
    </div>

  );
}
