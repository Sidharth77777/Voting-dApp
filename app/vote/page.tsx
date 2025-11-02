'use client'

import ConnectWalletPage from "../_components/ConnectWallet";
import { useWeb3 } from "../context/Web3Context"

export default function Vote() {
    const {account} = useWeb3();

    if (!account) return <ConnectWalletPage />

    return (
        <div className="min-h-screen bg-[#080812] text-white px-6 sm:px-12 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
            Active Polls
            </h1>
            <p className="mt-3 text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
            Participate in governance by casting your vote on active proposals.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto max-h-[75vh] p-3 scrollbar-thin scrollbar-thumb-[#1f1f3a] scrollbar-track-transparent">
            
            {[1, 2, 3, 4, 5, 6].map((poll) => (
            <div
                key={poll}
                className="group relative bg-linear-to-br from-[#101020] via-[#0f0f25] to-[#06060e] border border-[#1f1f3a] rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-2"
            >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-600/20 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl"></div>

                <div className="relative flex flex-col gap-4">
                <h2 className="text-xl font-semibold tracking-wide">
                    Proposal #{poll}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Should we increase the community fund allocation by 10% to support new developer grants?
                </p>

                <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Ends in 3 days</span>
                    <button className="px-4 py-2 text-sm font-medium rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 transition-all">
                    Vote Now
                    </button>
                </div>
                </div>
            </div>
            ))}

        </div>
        </div>

    )
}