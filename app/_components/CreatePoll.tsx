"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useWeb3 } from "../context/Web3Context";
import { uploadToPinata } from "@/pinata/uploadToPinata";
import { createGroupFunction } from "../context/contractFunctions";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function CreateGroup() {
  const router: AppRouterInstance = useRouter();
  const {account, contract} = useWeb3();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [requiresRegistered, setRequiresRegistered] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const createGroup = async(): Promise<void> => {
    if (!account || !contract) return;
    if (!name || !description || !startTime || !endTime || !imageFile) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);

    try {
      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);
      
      const res = await uploadToPinata(imageFile, "group");
      if (typeof res === "string") {
        toast.error(`Image upload failed: ${res}`);
        return;
      }
      const {cid, url} = res;

      const tx = await createGroupFunction(contract, name, url, cid, requiresRegistered, startTimestamp, endTimestamp, description);
      
      if (typeof tx === "string") {
        toast.error(tx);
        return;
      }

      toast.success("Group created successfully!");

      setDescription("");
      setEndTime("");
      setName("");
      setStartTime("");
      setRequiresRegistered(false);
      setImageFile(null);
      setPreview(null);

      router.push("/admin");
    } catch(err:any) {
      console.error("Create group error:", err);
      toast.error(err.message || "Internal Server Error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0c14] text-white px-3 py-10">
      <div className="max-w-3xl mx-auto bg-[#0f101b] border border-[#1d1f2b] rounded-2xl py-8 sm:px-8 px-4 shadow-xl">
        <h1 className="text-3xl text-center font-bold">Create Group</h1>

        <form className="flex flex-col gap-5 mt-6" onSubmit={(e) => e.preventDefault()}>

          <div className="flex flex-col">
            <label className="text-sm text-gray-400">Group Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 rounded-lg bg-[#090912] border border-[#15151b]"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-2">Group Image</label>

            <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-gray-700 bg-gray-900/60 hover:bg-gray-800/80 transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                onChange={handleFileChange}
              />

              {preview ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full max-h-full object-cover w-full h-full rounded-xl transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400 group-hover:text-gray-100 z-10 transition-colors duration-300">
                  <Upload className="w-8 h-8 mb-1 text-violet-500 group-hover:text-violet-400 transition-colors" />
                  <span className="text-xs font-medium">Click to upload</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 rounded-lg bg-[#090912] border border-[#15151b]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-400">Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="p-2 rounded-lg bg-[#090912] border border-[#15151b]"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-400">End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="p-2 rounded-lg bg-[#090912] border border-[#15151b]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={requiresRegistered}
              onChange={(e) => setRequiresRegistered(e.target.checked)}
            />
            <label className="text-sm text-gray-300">Require registered voters</label>
          </div>

          <Button 
          disabled={submitting}
          onClick={createGroup}
          className="w-full mt-4 cursor-pointer bg-green-600 text-black font-semibold py-2 rounded-lg">
            {submitting ? <Loader2 className="animate-spin" /> : "Create Group"}
          </Button>
        </form>
      </div>
    </div>
  );
}
