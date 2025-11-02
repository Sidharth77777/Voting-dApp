"use client";

import { Pencil, User, Wallet, Loader2 } from "lucide-react";
import ConnectWalletPage from "../_components/ConnectWallet";
import { useWeb3 } from "../context/Web3Context";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getProfileFunction, pinataCheck } from "../context/contractFunctions";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Profile() {
    const { account, contract, profile, setProfile } = useWeb3();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!account || !contract) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await getProfileFunction(contract, account);
                console.log(res);

                if (typeof res === "string") {
                    setProfile(null);
                    toast.error("Error fetching profile");
                    return;
                }
                setProfile(res);
            } catch (err: any) {
                console.error(err);
                toast.error("Error fetching profile");
            } finally {
                setLoading(false);
            }
        };

        if (profile) {
            setLoading(false);
        } else {
            fetchProfile();
        }
        //pinataCheck();
    }, [account, contract]);

    if (!account) return <ConnectWalletPage />;

    if (loading)
        return (
            <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center text-white">
                <Loader2 className="animate-spin w-14 h-14 text-blue-500 mb-4" />
                <p className="text-gray-400 text-lg tracking-wide">
                    Fetching your profile...
                </p>
            </div>
        );

    if (!profile?.exists)
        return (
            <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center text-white text-center p-10">
                <h2 className="text-2xl font-semibold mb-2">Access Restricted</h2>
                <p className="text-gray-400 max-w-md">
                    Only <span className="text-blue-400 font-semibold">approved voters</span> can edit or view
                    their profile.
                </p>
                <Button className="mt-4 cursor-pointer bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-full font-semibold hover:from-indigo-500 hover:to-blue-500 transition-all duration-300">Apply to be a Voter</Button>
            </div>
        );

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-linear-to-br from-[#090a1a] via-[#0a0a14] to-[#050510] flex flex-col items-center justify-center p-10 text-white"
        >
            <h1 className="text-4xl font-bold mb-10 tracking-wide text-center bg-linear-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">
                My Profile
            </h1>

            <div className="bg-[#111120] border border-[#1f1f3a] rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center transition-transform duration-300 hover:scale-[1.02]">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-linear-to-br from-green-500 to-blue-600 p-4 rounded-full mb-4 shadow-lg">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-xl text-center font-semibold">Connected Wallet</h2>
                </div>

                <div className="flex flex-col items-center gap-4 bg-[#191932] p-6 rounded-2xl border border-[#24244a] shadow-md w-full">
                    <div className="bg-linear-to-r from-blue-500 to-indigo-600 flex justify-center items-center rounded-full w-20 h-20 shadow-md">
                        <Wallet className="w-10 h-10 text-white" />
                    </div>

                    <p className="mt-2 text-lg font-mono text-gray-300">
                        {account
                            ? `${account.slice(0, 6)}....${account.slice(-6)}`
                            : "Not Connected"}
                    </p>

                    {profile?.name && (
                        <p className="text-xl font-semibold mt-2 text-white">
                            {profile.name}
                        </p>
                    )}

                    {profile?.age !== undefined && (
                        <p className="text-sm text-gray-400">Age: {profile.age}</p>
                    )}

                    <Button
                        className="mt-4 cursor-pointer bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-full font-semibold hover:from-indigo-500 hover:to-blue-500 transition-all duration-300"
                    >
                        Update Profile <Pencil className="w-5 ml-2" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
