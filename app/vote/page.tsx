'use client'

import ConnectWalletPage from "../_components/ConnectWallet";
import { useWeb3 } from "../context/Web3Context"

export default function Vote() {
    const {account} = useWeb3();

    if (!account) return <ConnectWalletPage />
    
    return (
        <div>
            VOTE
        </div>
    )
}