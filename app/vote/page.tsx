"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ConnectWalletPage from "../_components/ConnectWallet";
import { useWeb3 } from "../context/Web3Context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getGroupsFunction } from "../context/contractFunctions";

export default function Vote() {
    const router: AppRouterInstance = useRouter();
  const { account, contract } = useWeb3();

  useEffect(() => {
    if (!account || !contract) return;
    getGroupsFunction(contract)
  },[account])

  if (!account) return <ConnectWalletPage />;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((poll) => (
          <div
            key={poll}
            className="
                group relative
                rounded-2xl p-6 shadow-lg
                bg-[#1a1a2e]
                border border-[#303052]
                transition-all duration-300
                hover:-translate-y-2 hover:shadow-[0_0_25px_#a48fff40]
            "
          >
            <div
              className="
                absolute inset-0 rounded-2xl blur-xl
                opacity-0 group-hover:opacity-100 transition-all duration-300
                bg-[linear-gradient(to_bottom_right,#a48fff20,#30306010,transparent)]
                "
            ></div>

            <div className="relative flex flex-col gap-4 text-[#e2e2f5]">
              <h2 className="text-xl font-semibold tracking-wide text-[#e2e2f5]">
                Proposal #{poll}
              </h2>

              <p className="text-sm leading-relaxed text-[#a0a0c0]">
                Should we increase the community fund allocation by 10% to
                support new developer grants?
              </p>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-[#a0a0c0]">Ends in 3 days</span>

                <button
                onClick={() => router.push(`/vote/${poll}`)}
                  className="
                    px-4 py-2 text-sm font-medium rounded-lg
                    bg-[#a48fff] text-[#0f0f1a]
                    transition-all cursor-pointer
                    hover:brightness-110 hover:shadow-[0_0_12px_#a48fff80]
                    "
                >
                  Vote Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
