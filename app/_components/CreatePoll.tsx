"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

export default function CreatePoll() {
    return (
        <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full cursor-pointer mt-2 bg-linear-to-r from-green-500 to-emerald-600 text-black font-semibold py-2 rounded-lg hover:opacity-90 transition">Create New Poll</Button>
            </DialogTrigger>

            <DialogContent className="hide-scrollbar bg-gray-900 max-h-[90vh] overflow-x-hidden sm:overflow-hidden overflow-y-scroll border border-gray-800 text-white rounded-2xl shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Create a Poll
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-sm">
                        Fill out the informations below for creating a poll group.<br />
                    </DialogDescription>
                </DialogHeader>

                <form className="flex flex-col gap-4">
                    {/* Poll Title */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">Poll Title</label>
                        <input
                            value="Sample Poll Title"
                            placeholder="Enter poll title"
                            className="p-2 rounded-lg bg-[#090912] border border-[#15151b] text-white focus:ring-1 focus:ring-green-500 focus:outline-none"
                            readOnly
                        />
                    </div>

                    {/* Poll Description */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">Description</label>
                        <textarea
                            value="Short description about this poll (static preview)."
                            placeholder="Enter poll description"
                            className="p-2 rounded-lg bg-[#090912] border border-[#15151b] text-white focus:ring-1 focus:ring-green-500 focus:outline-none resize-none"
                            rows={3}
                            readOnly
                        />
                    </div>

                    {/* Candidates (static preview) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Candidates</label>
                        <input
                            type="text"
                            value="Search candidate by name or address"
                            readOnly
                            className="p-2 rounded-lg bg-[#090912] border border-[#15151b] text-gray-500 text-sm focus:outline-none"
                        />

                        {/* Static candidate list */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400">Select Candidate Address</label>

                            <select
                                value="0xA1b...23F4"
                                className="p-2 rounded-lg bg-[#090912] border border-[#15151b] text-white focus:ring-1 focus:ring-green-500 focus:outline-none"
                            >
                                {[
                                    { name: "Alice Johnson", address: "0xA1b...23F4" },
                                    { name: "Bob Martinez", address: "0xB2c...88E9" },
                                    { name: "Charlie Kim", address: "0xC3d...99A1" },
                                    { name: "Dana White", address: "0xD4e...55B3" },
                                ].map((c, i) => (
                                    <option key={i} value={c.address} className="bg-[#090912] text-white">
                                        {c.address}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* Date & Time */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-400">Start Date & Time</label>
                            <input
                                type="datetime-local"
                                value="2025-11-10T10:00"
                                className="p-2 rounded-lg bg-[#090912] border border-[#15151b] text-white focus:ring-1 focus:ring-green-500 focus:outline-none"
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-sm text-gray-400">End Date & Time</label>
                            <input
                                type="datetime-local"
                                value="2025-11-17T18:00"
                                className="p-2 rounded-lg bg-[#090912] border border-[#15151b] text-white focus:ring-1 focus:ring-green-500 focus:outline-none"
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked
                            className="accent-green-500 w-4 h-4"
                            readOnly
                        />
                        <label className="text-sm text-gray-300">Require registered voters</label>
                    </div>

                    {/* Submit */}
                    <Button
                        className="w-full mt-2 bg-linear-to-r from-green-500 to-emerald-600 text-black font-semibold py-2 rounded-lg hover:opacity-90 transition"
                        disabled
                    >
                        Create Poll (static)
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
        </div>
    )
}