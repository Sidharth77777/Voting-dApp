import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { PiStackSimpleFill } from "react-icons/pi";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#0a0a0a] text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center mb-10 gap-5">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-linear-to-tr from-indigo-500 to-purple-500 text-white">
                <PiStackSimpleFill size={28} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Voting DApp</h2>
                <p className="text-xs text-slate-400">Empowering decentralized governance</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Secure blockchain voting for transparent and fair elections.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-lg">Platform</h3>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/#HowItWorks" className="hover:text-white transition">How it Works</Link></li>
              <li><Link href="#" className="hover:text-white transition">Candidates</Link></li>
              <li><Link href="/vote" className="hover:text-white transition">Vote</Link></li>
              <li><Link href="/results" className="hover:text-white transition">Results</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-lg">Connect</h3>
            <div className="flex space-x-5">
              <Link href="https://github.com/Sidharth77777" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                <FaGithub size={22} />
              </Link>
              <Link href="https://x.com/cryptoSid1564" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                <FaXTwitter size={22} />
              </Link>
            </div>
            <div className="mt-6 flex items-center space-x-2 text-sm text-slate-400">
              <PiStackSimpleFill size={18} className="text-indigo-400" />
              <p>Powered by Sepolia Ethereum</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © 2025 <span className="text-white font-semibold">Voting DApp</span>
        </div>
      </div>
    </footer>
  );
}
