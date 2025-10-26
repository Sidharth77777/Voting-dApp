"use client";

import { useWeb3 } from "../context/Web3Context";
import { WalletConnectParamsTypes } from "@/types/types";
import { connectWalletFunction } from "../context/contractFunctions";
import { useToast } from "./Toast";
import { Button } from "@/components/ui/button";
import { bg, fg, primary, primaryFg, secondary, mutedFg, accent } from "@/colors";

export default function HeroSection() {
  const { account, setAccount, setContract, setProvider } = useWeb3();
  let { showToast } = useToast();

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

  return (
    <div
      className="relative flex justify-center items-center flex-col gap-8 text-left px-6 py-24 lg:px-0 overflow-hidden"
      style={{ backgroundColor: bg, color: fg }}
    >
      <h1
        className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-center tracking-tight"
        style={{ color: primary }}
      >
        Ethereum Blockchain
      </h1>

      <h2
        className="text-3xl sm:text-4xl lg:text-5xl text-center font-semibold"
        style={{ color: fg }}
      >
        Based Decentralized Voting
      </h2>

      <p
        className="text-lg sm:text-xl text-center max-w-2xl leading-relaxed opacity-80"
        style={{ color: mutedFg }}
      >
        Secure, decentralized, and transparent voting on the blockchain.
        Connect your wallet to start participating in governance today.
      </p>

      {!account ? <Button
        onClick={connectWallet}
        className="px-8 cursor-pointer py-4 rounded-2xl font-semibold text-lg shadow-2xl transform transition-all hover:scale-105 hover:shadow-xl"
        style={{
          background: `linear-gradient(${primary})`,
          color: primaryFg,
        }}
      >
        Connect Wallet
      </Button> : 
      <Button
        className="px-8 cursor-pointer py-4 rounded-2xl font-semibold text-lg shadow-2xl transform transition-all hover:scale-105 hover:shadow-xl"
        style={{
          background: `linear-gradient(${primary})`,
          color: primaryFg,
        }}>
        Cast your vote
      </Button>
      }
    </div>
  );
}
