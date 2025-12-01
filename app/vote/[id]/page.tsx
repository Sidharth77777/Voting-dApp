"use client";
import ConnectWalletPage from "@/app/_components/ConnectWallet";
import { useWeb3 } from "@/app/context/Web3Context";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function VotePage() {
  const { account, contract, profile } = useWeb3();
  const router: AppRouterInstance = useRouter();
  const { id } = useParams();
  const [selected, setSelected] = useState<null | number>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const options = [
    "Yes, increase by 10%",
    "No, keep it the same",
    "Increase by more than 10%",
    "Decrease allocation",
  ];

  const submitVote = () => {
    if (!selected) return alert("Please select an option before submitting.");
    setSubmitted(true);
  };

  if (!account || !contract) return <ConnectWalletPage />;

  if (!profile?.exists)
    return (
      <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center text-white text-center p-10">
        <h2 className="text-2xl font-semibold mb-2">Access Restricted</h2>
        <p className="text-gray-400 max-w-md">
          Only{" "}
          <span className="text-blue-400 font-semibold">approved voters</span>{" "}
          can vote in this group !
        </p>

        <Button
          onClick={() => router.push("/profile")}
          className="
                        cursor-pointer
                        mt-5
                        px-4 py-2 text-sm font-medium rounded-lg
                        bg-[#a48fff] text-[#0f0f1a]  
                        border border-[#303052]
                        transition-all duration-200
                        hover:brightness-110 hover:shadow-[0_0_14px_#a48fff60]
                        active:scale-95
                    "
        >
          Apply to be a verified voter
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen p-5">
      <div className="max-w-2xl mx-auto mt-12 p-6 rounded-2xl bg-[#1a1a2e] border border-[#303052] shadow-lg text-[#e2e2f5]">
        <h1 className="text-2xl font-bold mb-4">Proposal #{id}</h1>
        <p className="text-[#a0a0c0] mb-8">
          Should we increase the community fund allocation by 10% to support new
          developer grants?
        </p>

        {!submitted ? (
          <>
            <div className="flex flex-col gap-4">
              {options.map((opt, index) => (
                <div
                  key={index}
                  onClick={() => setSelected(index)}
                  className={`
                  p-4 rounded-xl cursor-pointer border transition-all 
                  ${
                    selected === index
                      ? "border-[#a48fff] bg-[#303060] shadow-[0_0_10px_#a48fff50]"
                      : "border-[#303052] bg-[#1a1a2e] hover:bg-[#222244]"
                  }
                `}
                >
                  {opt}
                </div>
              ))}
            </div>

            <button
            disabled={selected === null}
              onClick={submitVote}
              className="
              mt-6 w-full py-3 rounded-xl font-medium
              bg-[#a48fff] text-[#0f0f1a]
              hover:brightness-110 hover:shadow-[0_0_12px_#a48fff80]
            "
            >
              Submit Vote
            </button>
          </>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-3">Vote Submitted 🎉</h2>
            <p className="text-[#a0a0c0]">
              Thanks for participating in this proposal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
