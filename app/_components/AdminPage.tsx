"use client";

import { motion } from "framer-motion";
import {
    ShieldCheck,
    ListChecks,
    Users,
    UserPlus,
    Check,
    Upload,
    Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatePoll from "./CreatePoll";

const StatCard: React.FC<{ title: string; value: number; icon?: React.ReactNode }> = ({
    title,
    value,
    icon,
}) => (
    <div className="bg-[#0f1116] border border-[#1d1f2b] rounded-2xl p-4 w-full shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <div className="text-sm text-gray-400">{title}</div>
                <div className="text-2xl font-semibold mt-1">{value}</div>
            </div>
            <div className="text-2xl">{icon}</div>
        </div>
    </div>
);

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
    },{
        id: 3,
        title: "New Policy Amendment",
        description: "Vote for or against the new policy changes.",
        startDate: "2025-11-20",
        endDate: "2025-11-25",
        status: "Upcoming",
    },{
        id: 3,
        title: "New Policy Amendment",
        description: "Vote for or against the new policy changes.",
        startDate: "2025-11-20",
        endDate: "2025-11-25",
        status: "Upcoming",
    },
    
];

export default function AdminPage() {
    const stats = {
        totalPolls: mockPolls.length,
        totalVoters: 412,
        totalCandidates: 28,
        completedPolls: mockPolls.filter((p) => p.status === "Completed").length,
    };

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
                        value={stats.totalPolls}
                        icon={<ListChecks className="text-blue-400" />}
                    />
                    <StatCard
                        title="Total Voters"
                        value={stats.totalVoters}
                        icon={<Users className="text-cyan-400" />}
                    />
                    <StatCard
                        title="Total Candidates"
                        value={stats.totalCandidates}
                        icon={<UserPlus className="text-violet-400" />}
                    />
                    <StatCard
                        title="Completed Polls"
                        value={stats.completedPolls}
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
                            count={mockVoters.length}
                            items={mockVoters}
                            type="voter"
                        />

                        {/* CANDIDATE APPLICATIONS */}
                        <Section
                            title="Pending Candidate Applications"
                            count={mockCandidates.length}
                            items={mockCandidates}
                            type="candidate"
                        />

                        {/* CREATED POLLS */}
                        <div className="bg-[#0f1116] border border-[#1d1f2b] max-h-[50vh] rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Created Polls</h3>
                                <span className="text-sm text-gray-400">{mockPolls.length} total</span>
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

                            <CreatePoll />

                        </div>


                        {/* QUICK ACTIONS */}
                        <div className="bg-[#0f1116] border border-[#1d1f2b] rounded-2xl p-4 shadow-sm">
                            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                            <div className="flex flex-col gap-2">
                                <button
                                    className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60"
                                    disabled
                                >
                                    Refresh data
                                </button>
                                <button
                                    className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-700 text-gray-300"
                                    disabled
                                >
                                    Export stats
                                </button>
                                <button
                                    className="w-full px-3 py-2 rounded-lg bg-transparent border border-gray-700 text-gray-300"
                                    disabled
                                >
                                    View blockchain logs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

const Section: React.FC<{
    title: string;
    count: number;
    items: { addr: string; name: string; image?: string }[];
    type: "voter" | "candidate";
}> = ({ title, count, items, type }) => (
    <div className="bg-[#0f1116] border border-[#1d1f2b] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">{title}</h3>
            <span className="text-sm text-gray-400">{count} pending</span>
        </div>

        {items.length === 0 ? (
            <div className="py-6 text-center text-gray-400">No pending {type} applications</div>
        ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto hide-scrollbar">
                {items.map((item, idx) => (
                    <div
                        key={`${item.addr}-${idx}`}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0b0c11] border border-[#15151b]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-[#090912] flex items-center justify-center overflow-hidden">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <UserPlus className="sm:w-6 sm:h-6 w-5 h-5 text-gray-500" />
                                )}
                            </div>
                            <div>
                                <div className="font-semibold sm:text-lg text-[14px]">
                                    {item.name}
                                </div>
                                <div className="sm:text-xs text-gray-400 font-mono text-[12px]">
                                    {item.addr}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="px-3 py-1 rounded-lg bg-green-500 text-black font-medium hover:bg-green-600 transition disabled:opacity-60"
                                disabled
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);
