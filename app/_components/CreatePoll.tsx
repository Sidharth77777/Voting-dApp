"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CreatePoll() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [requireApproved, setRequireApproved] = useState<boolean>(false);
  const [showImages, setShowImages] = useState<boolean>(false);
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCandidates, setSelectedCandidates] = useState<
    { address: string; name: string }[]
  >([]);

  const allCandidates = [
    { name: "Alice Johnson", address: "0xA1b...23F4" },
    { name: "Bob Martinez", address: "0xB2c...88E9" },
    { name: "Charlie Kim", address: "0xC3d...99A1" },
    { name: "Dana White", address: "0xD4e...55B3" },
    { name: "Elena Cruz", address: "0xE5f...77C2" },
  ];

  const filteredCandidates = allCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addCandidate = (candidate: { name: string; address: string }) => {
    if (!selectedCandidates.some((c) => c.address === candidate.address)) {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
    setSearchTerm("");
  };

  const updateCandidateName = (address: string, newName: string) => {
    setSelectedCandidates((prev) =>
      prev.map((c) => (c.address === address ? { ...c, name: newName } : c))
    );
  };

  const removeCandidate = (address: string) => {
    setSelectedCandidates(selectedCandidates.filter((c) => c.address !== address));
  };

  return (
    <div className="min-h-screen bg-[#0b0c14] text-white px-3 py-10">
      <div className="max-w-3xl mx-auto bg-[#0f101b] border border-[#1d1f2b] rounded-2xl py-8 sm:px-8 px-4 shadow-xl">
        <h1 className="text-3xl text-center font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Create a Poll
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Fill out the information below to create a new poll.
        </p>

        <form className="flex flex-col gap-5 mt-6">
          {/* Poll Title */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Poll Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter poll title"
              className="p-2 rounded-lg bg-[#090912] border border-[#15151b] text-white focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter poll description"
              rows={3}
              className="p-2 rounded-lg bg-[#090912] border border-[#15151b] text-white focus:ring-1 focus:ring-green-500 focus:outline-none resize-none"
            />
          </div>

          {/* Candidate Selector */}
          <div className="flex flex-col gap-3 relative">
            <label className="text-sm text-gray-400">Select Candidate Address</label>

            {/* Search box */}
            <div className="p-2 rounded-lg bg-[#090912] border border-[#15151b] focus-within:ring-1 focus-within:ring-green-500">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or address"
                className="bg-transparent text-white w-full focus:outline-none text-sm"
              />
            </div>

            {/* Dropdown suggestions */}
            {searchTerm && (
              <div className="absolute top-full mt-1 w-full bg-[#0e0e18] border border-[#1f1f2b] rounded-lg shadow-lg max-h-40 overflow-y-auto z-50">
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((c, i) => (
                    <div
                      key={i}
                      onClick={() => addCandidate(c)}
                      className="cursor-pointer px-3 py-2 hover:bg-green-500/10 flex flex-col"
                    >
                      <span className="text-sm text-white">{c.name}</span>
                      <span className="text-xs text-gray-400">{c.address}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            )}

            {/* Selected candidates list */}
            {selectedCandidates.length > 0 && (
              <div className="flex flex-col gap-3 bg-[#090912] border border-[#15151b] p-3 rounded-lg">
                <label className="text-sm text-gray-400 mb-1">
                  Selected Candidates
                </label>
                {selectedCandidates.map((c, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#0f0f1b] border border-[#1d1d2f] p-1 rounded-lg"
                  >
                    <div className="flex flex-col w-full sm:w-1/2">
                      <label className="text-xs text-gray-400 mb-1">Address</label>
                      <input
                        type="text"
                        value={c.address}
                        readOnly
                        className="p-2 rounded-md bg-[#0a0a14] border border-[#1b1b27] text-gray-400 text-sm"
                      />
                    </div>

                    <div className="flex flex-col w-full sm:w-1/2">
                      <label className="text-xs text-gray-400 mb-1">Name</label>
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) =>
                          updateCandidateName(c.address, e.target.value)
                        }
                        className="p-2 rounded-md bg-[#0a0a14] border border-[#1b1b27] text-white text-sm focus:ring-1 focus:ring-green-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeCandidate(c.address)}
                      className="text-red-500 hover:text-red-900 cursor-pointer text-xs sm:text-sm mt-2 sm:mt-5"
                    >
                    ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm text-gray-400">Start Date & Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="p-2 rounded-lg bg-[#090912] border border-[#15151b] text-white focus:ring-1 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm text-gray-400">End Date & Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="p-2 rounded-lg bg-[#090912] border border-[#15151b] text-white focus:ring-1 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={requireApproved}
                onChange={(e) => setRequireApproved(e.target.checked)}
                className="accent-green-500 w-4 h-4"
              />
              <label className="text-sm text-gray-300">
                Require registered voters
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showImages}
                onChange={(e) => setShowImages(e.target.checked)}
                className="accent-green-500 w-4 h-4"
              />
              <label className="text-sm text-gray-300">
                Show Candidate Images
              </label>
            </div>
          </div>

          {/* Submit */}
          <Button
            className="w-full mt-4 bg-linear-to-r from-green-500 to-emerald-600 text-black font-semibold py-2 rounded-lg hover:opacity-90 transition"
            disabled
          >
            Create Poll (static)
          </Button>
        </form>
      </div>
    </div>
  );
}
