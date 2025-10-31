'use client'

import ConnectWalletPage from "../_components/ConnectWallet";
import { useWeb3 } from "../context/Web3Context"

export default function Profile() {
    const {account} = useWeb3();

    if (!account) return <ConnectWalletPage />
    
    return (
        <div>
            PROFILE
        </div>
    )
}