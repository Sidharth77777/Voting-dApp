import { ethers } from "ethers";
import { ABI, PROXY_CONTRACT_ADDRESS } from "./constants";
import { WalletConnectParamsTypes } from "@/types/types";

export const connectWalletFunction = async(): Promise<WalletConnectParamsTypes | void> => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    try{
        const provider: ethers.BrowserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer: ethers.JsonRpcSigner = await provider.getSigner();
        const contract: ethers.Contract = new ethers.Contract(PROXY_CONTRACT_ADDRESS, ABI, signer);

        const accounts: string[] = await provider.send("eth_requestAccounts", []);
        const account: string = accounts[0];

        await provider.send('wallet_switchEthereumChain', [{ chainId: "0xaa36a7"}]);

        return {account, contract, provider};

    } catch (error: any) {
        if (error.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: "0xaa36a7",
                        chainName: "Sepolia Testnet",
                        rpcUrls: ["https://rpc.sepolia.org"],
                        nativeCurrency: { name: "SepoliaETH", symbol: "SEP", decimals: 18 },
                        blockExplorerUrls: ["https://sepolia.etherscan.io"],
                    },
                ],

            })
        }
        console.error("Error connecting wallet:", error);
        return;
    }
}

export const fetchBalanceFunction = async(account:string, provider:ethers.BrowserProvider): Promise<string | null> => {
    if (!window.ethereum) return null;
    if (!account || !provider) return null;

    try {
        const balanceInWei:bigint = await provider.getBalance(account);
        const balance:string = ethers.formatEther(balanceInWei);

        return balance;
    } catch(error:any) {
        console.error('Error fetching balance :',error);
        return null;
    }

}