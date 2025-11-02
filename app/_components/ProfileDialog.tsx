"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { applyToBeVoterFunction } from "../context/contractFunctions";
import { uploadToPinata } from "@/pinata/uploadToPinata";

export default function ApplyVoterDialog() {
    const { account, contract } = useWeb3();
    const [name, setName] = useState<string | null>(null);
    const [age, setAge] = useState<number | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("No file selected");
    const [image, setImage] = useState<File | null>(null);

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setFileName(file.name);
            setImage(file);
        }
    };

const submitApplication = async (): Promise<void> => {
    if (!account || !contract) return;

    if (!name || age === null || age === undefined || age === 0) {
        toast.error("Please fill all fields");
        return;
    }

    const numericAge = Number(age);

    if (!Number.isInteger(numericAge)) {
        toast.error("Age should not be decimal");
        return; 
    }
    if (numericAge <= 0) {
        toast.error("Age must be positive");
        return;
    }

    setSubmitting(true);

    try {
        if (!image) {
            const res = await applyToBeVoterFunction(contract, name, account, numericAge, "", "");
            if (typeof res === "string") {
                toast.error(res);
            } else {
                toast.success("Successfully Applied");
                setName(null);
                setAge(null);
            }
            return;
        }

        setUploading(true);
        const imageRes = await uploadToPinata(image, "voter");
        setUploading(false);

        if (typeof imageRes === "string") {
            toast.error(imageRes);
            return;
        }

        const res = await applyToBeVoterFunction(contract, name, account, numericAge, imageRes.url, imageRes.cid);

        if (typeof res === "string") {
            toast.error(res);
        } else {
            toast.success("Successfully Applied");
            setName(null);
            setAge(null);
            setFileName("No file selected");
            setImage(null);
            setPreview(null);
        }
    } catch (err: any) {
        console.error(err);
        toast.error("Error submitting application");
    } finally {
        setSubmitting(false);
        setUploading(false);
    }
};

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mt-4 cursor-pointer bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-full font-semibold hover:from-indigo-500 hover:to-blue-500 transition-all duration-300">
                        Apply to be a Voter
                    </Button>
                </DialogTrigger>

                <DialogContent className="bg-gray-900 border border-gray-800 text-white rounded-2xl shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Apply to be a Voter
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 text-sm">
                            Fill out your information below to apply as a registered voter.<br />
                            <span className="text-red-500">NB: Your name and age can't be updated later !</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-5 mt-4">

                        <div className="flex flex-col items-center gap-4">
                            <label className="text-sm font-semibold text-gray-200 self-start">Profile Image</label>

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

                            <div className="flex flex-col items-center">
                                <p className="text-xs text-gray-400 truncate max-w-[200px]">
                                    {fileName}
                                </p>
                                <p className="text-xs text-gray-500">JPG, PNG, or GIF up to 5MB</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-300">Full Name</label>
                                <input
                                    type="text"
                                    value={name || ""}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="p-2 rounded-xl bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-300">Age</label>
                                <input
                                    type="number"
                                    value={age ?? ""}
                                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : null)}
                                    placeholder="Enter your age"
                                    className="p-2 rounded-xl bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-300">Wallet Address</label>
                                <input
                                    type="text"
                                    disabled
                                    value={account || ""}
                                    className="p-2 rounded-xl bg-gray-800 border border-gray-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <Button
                            type="button"
                            className="mt-2 w-full cursor-pointer bg-[#a48fff] hover:bg-[#6e51ef] text-black font-bold transition-all duration-100 rounded-xl font-semibold text-sm py-2 shadow-md"
                            onClick={submitApplication}
                            disabled={!name || !age || !account || submitting}
                        >

                            {uploading ? "Uploading Image" : submitting ? "Submitting Application" : "Submit Application"}
                            {submitting && <Loader2 className="animate-spin w-10 h-10 text-violet-800" />}

                        </Button>

                    </div>

                </DialogContent>
            </Dialog>
        </div>
    );
}
