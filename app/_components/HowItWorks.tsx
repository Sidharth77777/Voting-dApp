import { ChartNoAxesColumn, Users, Vote, Wallet } from "lucide-react"
import { WorkFlowType } from "@/types/types"

export default function HowItWorks() {

    const workFlow: WorkFlowType[] = [
        {
            id: 1, icon: Wallet, head: "Connect Wallet", 
            p: "Link your MetaMask wallet securely to get started with blockchain voting."
        },
        {
            id: 2, icon: Users, head: "Choose a Candidate", 
            p: "Browse through verified candidates and review their proposals and vision"
        },
        {
            id: 3, icon: Vote, head: "Vote securely", 
            p: "Cast your vote with confidence using smart contact technology on Ethereum"
        },
        {
            id: 4, icon: ChartNoAxesColumn, head: "View Results", 
            p: "Track voting results in real time with full transparency on the blockchain"
        },
    ]

    return (
        <div id='HowItWorks' className="w-full py-20 bg-[#0a0a0a] text-slate-100">
  <div className="mb-16 text-center">
    <h1 className="text-3xl sm:text-4xl font-bold tracking-wide mb-3 text-white">
      HOW IT WORKS
    </h1>
    <h3 className="opacity-80 text-lg">
      Four simple steps to participate in decentralized governance
    </h3>
  </div>

  <div className="flex flex-wrap justify-center gap-8 px-6 max-w-6xl mx-auto">
    {workFlow && workFlow.map((w) => (
      <div
        key={w.id}
        className="bg-[#111120] border border-[#19192e] rounded-2xl shadow-lg p-8 w-full sm:w-[45%] lg:w-[22%] text-center hover:-translate-y-2 transition-transform duration-300"
      >
        <div className="flex justify-center items-center mb-5">
          <div className="p-4 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md">
            <w.icon size={32} />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">{w.head}</h3>

        <p className="text-sm text-slate-400 leading-relaxed">{w.p}</p>
      </div>
    ))}


  </div>
</div>

    )
}