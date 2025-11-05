"use client";

import { Pencil, User, Wallet, Loader2 } from "lucide-react";
import ConnectWalletPage from "../_components/ConnectWallet";
import { useWeb3 } from "../context/Web3Context";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { checkIfAlreadyAppliedToBeVoter, getProfileFunction, pinataCheck } from "../context/contractFunctions";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ProfileDialog from "../_components/ProfileDialog";
import Image from "next/image";
import UpdateImageDialog from "../_components/UpdateImageDialog";

export default function Profile() {
    const { account, contract, profile, setProfile } = useWeb3();
    const [loading, setLoading] = useState<boolean>(true);
    const [alreadyApplied, setAlreadyApplied] = useState<boolean>(false);
    const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

    const checkIfAlreadyApplied = async (): Promise<void> => {
        if (!account || !contract) return;

        try {
            const check = await checkIfAlreadyAppliedToBeVoter(contract, account);
            if (typeof check === "boolean") {
                //console.log("Checking.....",check);
                if (check === true) setAlreadyApplied(true);
                setCheckingStatus(false);
            } else {
                console.log(check);
            }

        } catch (err: any) {
            console.error(err);
        } finally {
            setCheckingStatus(false);
        }

    }

    useEffect(() => {
        if (!account || !contract) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await getProfileFunction(contract, account);

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
        checkIfAlreadyApplied();
        //pinataCheck();
    }, [account, contract]);

    if (!account) return <ConnectWalletPage />;

    if (loading || checkingStatus)
        return (
            <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center text-white">
                <Loader2 className="animate-spin w-14 h-14 text-blue-500 mb-4" />
                <p className="text-gray-400 text-lg tracking-wide">
                    Fetching your profile...
                </p>
            </div>
        );

    if (alreadyApplied && !profile?.exists)
        return (
            <div className="p-6 min-h-screen flex justify-center items-center flex-col rounded-2xl bg-[#10101b] border border-gray-800 text-center shadow-md">
                <h2 className="text-xl font-semibold bg-linear-to-r from-violet-400 to-blue-500 bg-clip-text text-transparent mb-2">
                    You've Already Applied to be a voter 🎉
                </h2>
                <p className="text-gray-400 text-sm">
                    Your application is currently under review. You'll be notified once it's approved.
                </p>
            </div>
        );

    if (!profile?.exists && !alreadyApplied)
        return (
            <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center text-white text-center p-10">
                <h2 className="text-2xl font-semibold mb-2">Access Restricted</h2>
                <p className="text-gray-400 max-w-md">
                    Only <span className="text-blue-400 font-semibold">approved voters</span> can edit or view
                    their profile.
                </p>

                <ProfileDialog />

            </div>
        );


    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-linear-to-br from-[#090a1a] via-[#0a0a14] to-[#050510] flex flex-col items-center justify-center p-5 text-white"
        >
            <div>
                <h1 className="text-4xl font-bold mb-10 tracking-wide text-center bg-linear-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">
                    My Profile
                </h1>
            </div>

            <div className="bg-[#111120] border border-[#1f1f3a] rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center transition-transform duration-300 hover:scale-[1.02]">
                <div className="flex flex-col items-center mb-6">
                    <div className={`${!profile?.image ? 'p-4' : 'w-[90] h-[90]'} bg-linear-to-br from-green-500 to-blue-600 rounded-full mb-4 shadow-lg`}>

                        {profile?.image
                            ? <Image src={profile.image} alt="user" width={90} height={90} className="w-full h-full rounded-full object-cover" />
                            : <User className="w-10 h-10 text-white" />
                        }

                    </div>

                    <UpdateImageDialog profile={profile} />
                    
                    <h2 className="text-xl mt-5 text-center font-semibold">Connected Wallet</h2>
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

                    <div className="mt-2 flex items-center gap-2"> <span className="flex items-center bg-green-500/20 text-green-400 border border-green-500/40 px-3 py-1 rounded-full text-xs font-semibold"> <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /> </svg> Approved </span> </div>

                    {profile?.age !== undefined && (
                        <p className="text-sm text-gray-400">Age: {profile.age}</p>
                    )}

                </div>
            </div>
        </motion.div>
    );
}
