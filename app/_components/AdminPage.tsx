"use client";

import { motion } from "framer-motion";
import {
    ShieldCheck,
    ListChecks,
    Users,
    UserPlus,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "../context/Web3Context";
import { AdminPageProps, CandidatesToBeApprovedType, VotersToBeApprovedType } from "@/types/types";
import { addVoterByApprovalFunction, changeOwnerFunction, getCandidatesLengthFunction, getCandidatesToBeAllowedFunction, getCompletedPollsLengthFunction, getTotalCandidatesToBeApprovedFunction, getTotalPollsLengthFunction, getTotalVotersToBeApprovedFunction, getVotersLengthFunction, getVotersToBeAllowedFunction } from "../context/contractFunctions";
import StatCard from "./StatCard";
import Section from "./Section";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// mock data
const mockVoters = Array(6).fill({
    addr: "0xAbc...1234",
    name: "Alice Johnson",
    image: "",
});

const mockCandidates = Array(7).fill({
    addr: "0x9Aa...88ff",
    name: "Daniel K.",
    image: "",
});

const mockPolls = [
    {
        id: 1,
        title: "Board Election 2025",
        description: "Select members for the 2025 Board Committee.",
        startDate: "2025-11-10",
        endDate: "2025-11-17",
        status: "Active",
    },
    {
        id: 2,
        title: "Annual Budget Approval",
        description: "Vote to approve the yearly budget plan.",
        startDate: "2025-10-01",
        endDate: "2025-10-07",
        status: "Completed",
    },
    {
        id: 3,
        title: "New Policy Amendment",
        description: "Vote for or against the new policy changes.",
        startDate: "2025-11-20",
        endDate: "2025-11-25",
        status: "Upcoming",
    }, {
        id: 4,
        title: "New Policy Amendment",
        description: "Vote for or against the new policy changes.",
        startDate: "2025-11-20",
        endDate: "2025-11-25",
        status: "Upcoming",
    }, {
        id: 5,
        title: "New Policy Amendment",
        description: "Vote for or against the new policy changes.",
        startDate: "2025-11-20",
        endDate: "2025-11-25",
        status: "Upcoming",
    },

];

export default function AdminPage({ owner }: AdminPageProps) {
    const { account, contract } = useWeb3();
    const router: AppRouterInstance = useRouter();
    const [newOwner, setNewOwner] = useState<string>("");
    const [loadingAll, setLoadingAll] = useState<boolean>(false);
    const [totalVoters, setTotalVoters] = useState<number>(0);
    const [totalCandidates, setTotalCandidates] = useState<number>(0);
    const [totalPolls, setTotalPolls] = useState<number>(0);
    const [totalCompletedPolls, setTotalCompletedPolls] = useState<number>(0);
    const [totalApprovableVoters, setTotalApprovableVoters] = useState<number>(0);
    const [totalApprovableCandidates, setTotalApprovableCandidates] = useState<number>(0);
    const [totalPendingVoters, setTotalPendingVoters] = useState<VotersToBeApprovedType[]>([]);
    const [totalPendingCandidates, setTotalPendingCandidates] = useState<CandidatesToBeApprovedType[]>([]);

    const fetchAll = async () => {
        if (!account || !contract) return;
        try {
            setLoadingAll(true);
            const [
                votersLength,
                candidatesLength,
                totalPolls,
                completedPolls,
                approvableVoters,
                approvableCandidates,
                pendingVoters,
                pendingCandidates,
            ] = await Promise.all([
                getVotersLengthFunction(contract),
                getCandidatesLengthFunction(contract),
                getTotalPollsLengthFunction(contract),
                getCompletedPollsLengthFunction(contract),
                getTotalVotersToBeApprovedFunction(contract),
                getTotalCandidatesToBeApprovedFunction(contract),
                getVotersToBeAllowedFunction(contract),
                getCandidatesToBeAllowedFunction(contract)
            ]);

            if (typeof votersLength !== "string") setTotalVoters(votersLength);
            if (typeof candidatesLength !== "string") setTotalCandidates(candidatesLength);
            if (typeof totalPolls !== "string") setTotalPolls(totalPolls);
            if (typeof completedPolls !== "string") setTotalCompletedPolls(completedPolls);
            if (typeof approvableVoters !== "string") setTotalApprovableVoters(approvableVoters);
            if (typeof approvableCandidates !== "string") setTotalApprovableCandidates(approvableCandidates);
            if (typeof pendingVoters !== "string") setTotalPendingVoters(pendingVoters);
            if (typeof pendingCandidates !== "string") setTotalPendingCandidates(pendingCandidates);
            setLoadingAll(false);
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
            setLoadingAll(false);
        }
    }

    useEffect(() => {
        if (!owner || !contract) return;
        fetchAll();
    }, [owner, contract]);

    const handleChangeOwner = async () => {
        if (!owner || !contract) return;

        try {
            const newAdmin = await changeOwnerFunction(contract, newOwner);
            if (typeof newAdmin !== "string") {
                toast.success("ADMIN of contract changed !");
                fetchAll();
            } else {
                toast.error(newAdmin);
                return;
            }
        } catch (err:any) {
            console.error(err);
            toast.error(err);
            return;
        }
    }

    const addVoterByApproval = async (voterAddress: string): Promise<void> => {
        if (!owner || !contract) return;

        try {
            const res = await addVoterByApprovalFunction(contract, voterAddress);
            if (!(typeof res === "string")) {
                toast.success("Approved as Voter !");
                fetchAll();
            } else {
                toast.error(res);
            }

        } catch (err: any) {
            console.error(err);
            toast.error(err);
            return;
        }
    }

    const addCandidateByApproval = async (candidateAddress: string) => {
        console.log("Iam a candidate");

    }

    if (loadingAll) return (
        <div className="flex min-h-screen flex-col items-center justify-center h-40 space-y-3">
            <div className="w-10 h-10 border-4 border-gray-700 border-t-[#1a1a2e] rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">Loading dashboard data...</p>
        </div>
    )

    return (
        <div className="min-h-screen w-full overflow-x-hidden p-4 sm:p-8 bg-[#0a0a14] text-white">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
            >
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                    <ShieldCheck className="w-10 h-10 text-green-400" />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-sm text-gray-400 max-w-lg">
                            Manage the voting platform — review applications, create polls, and monitor statistics.
                        </p>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Total Polls"
                        value={totalPolls}
                        icon={<ListChecks className="text-blue-400" />}
                    />
                    <StatCard
                        title="Total Voters"
                        value={totalVoters}
                        icon={<Users className="text-cyan-400" />}
                    />
                    <StatCard
                        title="Total Candidates"
                        value={totalCandidates}
                        icon={<UserPlus className="text-violet-400" />}
                    />
                    <StatCard
                        title="Completed Polls"
                        value={totalCompletedPolls}
                        icon={<Check className="text-green-400" />}
                    />
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT SIDE */}
                    <div className="col-span-1 lg:col-span-2 space-y-6">
                        {/* VOTER APPLICATIONS */}
                        <Section
                            title="Pending Voter Applications"
                            count={totalApprovableVoters}
                            items={totalPendingVoters}
                            type="voter"
                            addVoterByApproval={addVoterByApproval}
                        />

                        {/* CANDIDATE APPLICATIONS */}
                        <Section
                            title="Pending Candidate Applications"
                            count={totalApprovableCandidates}
                            items={totalPendingCandidates}
                            type="candidate"
                            addCandidateByApproval={addCandidateByApproval}
                        />

                        {/* CREATED POLLS */}
                        <div className="bg-[#0f1116] border border-[#1d1f2b] max-h-[50vh] rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Created Polls</h3>
                                <span className="text-sm text-gray-400">{totalPolls} total</span>
                            </div>

                            <div className="hide-scrollbar max-h-[40vh] overflow-y-auto">
                                {mockPolls.length === 0 ? (
                                    <div className="py-6 text-center text-gray-400">
                                        No polls have been created yet
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {mockPolls.map((poll) => (
                                            <div
                                                key={poll.id}
                                                className="p-3 bg-[#0b0c11] border border-[#15151b] rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                                            >
                                                <div>
                                                    <div className="font-semibold">{poll.title}</div>
                                                    <div className="text-xs text-gray-400">{poll.description}</div>
                                                    <div className="text-[11px] text-gray-500 mt-1 font-mono">
                                                        {poll.startDate} → {poll.endDate}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-lg ${poll.status === "Active"
                                                        ? "bg-green-500 text-black"
                                                        : poll.status === "Completed"
                                                            ? "bg-gray-600 text-white"
                                                            : "bg-blue-500 text-black"
                                                        }`}
                                                >
                                                    {poll.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="space-y-6">
                        {/* CREATE POLL */}
                        <div className="bg-[#0f1116] border border-[#1d1f2b] rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Create Poll</h3>

                            <Button
                                onClick={() => router.push('/admin/create-poll')}
                                className="w-full cursor-pointer mt-2 bg-linear-to-r from-green-500 to-emerald-600 text-black font-semibold py-2 rounded-lg hover:opacity-90 transition">
                                Create New Poll
                            </Button>

                        </div>

                        <div className="space-y-6">
                            <div className="rounded-2xl bg-[#0f1116] border border-[#1d1f2b] p-6 shadow-lg hover:shadow-orange-500/10 transition-all">
                                <Dialog>
                                    {/* ✅ use asChild for correct trigger behavior */}
                                    <DialogTrigger asChild>
                                        <Button className="w-full mt-2 bg-linear-to-r from-orange-400 to-orange-700 text-black font-semibold py-2 rounded-xl shadow-md hover:from-orange-500 hover:to-orange-800 cursor-pointer transition-all">
                                            Change Owner of Contract
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-md bg-[#101218] border border-[#1d1f2b] text-white rounded-2xl shadow-xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-semibold text-orange-400">
                                                Change Contract Owner
                                            </DialogTitle>
                                            <DialogDescription className="text-gray-400">
                                                Enter the new owner's wallet address below.
                                                <br />
                                                <span className="text-red-500 uppercase font-medium">This action cannot be undone <br />You cannot access the ADMIN page again without the new owner's approval ! </span>
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="py-4">
                                            <input
                                                placeholder="0x1234...abcd"
                                                value={newOwner ?? ""}
                                                onChange={(e) => setNewOwner(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg bg-[#0c0e13] border border-[#2a2d3a] font-mono text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                                            />
                                        </div>

                                        <DialogFooter className="flex justify-end gap-3">
                                            <Button
                                                disabled={!newOwner}
                                                variant="outline"
                                                className="border cursor-pointer border-gray-600 text-gray-300 hover:bg-gray-800"
                                                onClick={() => setNewOwner("")}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                disabled={!newOwner}
                                                className="bg-linear-to-r cursor-pointer from-orange-400 to-orange-700 text-black font-semibold hover:from-orange-500 hover:to-orange-800 transition-all"
                                                onClick={handleChangeOwner}
                                            >
                                                Confirm Change
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>


                        {/* QUICK ACTIONS */}
                        <div className="bg-[#0f1116] border border-[#1d1f2b] rounded-2xl p-4 shadow-sm">
                            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                            <div className="flex flex-col gap-2">
                                <Button
                                    className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60"
                                    disabled
                                >
                                    Refresh data
                                </Button>
                                <Button
                                    className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-700 text-gray-300"
                                    disabled
                                >
                                    Export stats
                                </Button>
                                <Button
                                    className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-700 text-gray-300"
                                    disabled
                                >
                                    View blockchain logs
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
